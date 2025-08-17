import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { ppidRequestsTable, usersTable } from '../db/schema';
import { type CreatePPIDRequestInput, type PPIDRequestStatus } from '../schema';
import {
    createPPIDRequest,
    getPPIDRequestById,
    getPPIDRequestByNumber,
    updatePPIDRequest,
    getPPIDRequests,
    assignPPIDRequest,
    getPPIDStatistics
} from '../handlers/ppid';
import { eq } from 'drizzle-orm';

// Test input for creating PPID requests
const testPPIDInput: CreatePPIDRequestInput = {
    requester_name: 'John Doe',
    requester_email: 'john.doe@example.com',
    requester_phone: '081234567890',
    id_number: '1234567890123456',
    information_requested: 'Fire safety inspection reports for downtown area',
    purpose: 'Academic research on fire safety compliance'
};

// Helper function to create a test user
async function createTestUser() {
    const result = await db.insert(usersTable)
        .values({
            username: 'testuser',
            email: 'test@example.com',
            password_hash: 'hashedpassword',
            full_name: 'Test User',
            role: 'ppid_admin'
        })
        .returning()
        .execute();
    
    return result[0];
}

describe('PPID Request Handlers', () => {
    beforeEach(createDB);
    afterEach(resetDB);

    describe('createPPIDRequest', () => {
        it('should create a PPID request successfully', async () => {
            const result = await createPPIDRequest(testPPIDInput);

            // Verify returned data
            expect(result.requester_name).toEqual('John Doe');
            expect(result.requester_email).toEqual(testPPIDInput.requester_email);
            expect(result.requester_phone).toEqual(testPPIDInput.requester_phone);
            expect(result.id_number).toEqual(testPPIDInput.id_number);
            expect(result.information_requested).toEqual(testPPIDInput.information_requested);
            expect(result.purpose).toEqual(testPPIDInput.purpose);
            expect(result.status).toEqual('submitted');
            expect(result.id).toBeDefined();
            expect(result.request_number).toBeDefined();
            expect(result.submitted_at).toBeInstanceOf(Date);
            expect(result.updated_at).toBeInstanceOf(Date);
            expect(result.response_data).toBeNull();
            expect(result.decision_reason).toBeNull();
            expect(result.assigned_to).toBeNull();
            expect(result.responded_at).toBeNull();
        });

        it('should generate unique request numbers', async () => {
            const result1 = await createPPIDRequest(testPPIDInput);
            
            // Small delay to ensure different timestamps
            await new Promise(resolve => setTimeout(resolve, 1));
            
            const result2 = await createPPIDRequest({
                ...testPPIDInput,
                requester_email: 'jane.doe@example.com'
            });

            expect(result1.request_number).toBeDefined();
            expect(result2.request_number).toBeDefined();
            expect(result1.request_number).not.toEqual(result2.request_number);
            expect(result1.request_number).toMatch(/^PPID-\d{8}-\d{9}$/);
            expect(result2.request_number).toMatch(/^PPID-\d{8}-\d{9}$/);
        });

        it('should save to database correctly', async () => {
            const result = await createPPIDRequest(testPPIDInput);

            const saved = await db.select()
                .from(ppidRequestsTable)
                .where(eq(ppidRequestsTable.id, result.id))
                .execute();

            expect(saved).toHaveLength(1);
            expect(saved[0].requester_name).toEqual('John Doe');
            expect(saved[0].status).toEqual('submitted');
            expect(saved[0].submitted_at).toBeInstanceOf(Date);
        });
    });

    describe('getPPIDRequestById', () => {
        it('should retrieve a PPID request by ID', async () => {
            const created = await createPPIDRequest(testPPIDInput);
            const retrieved = await getPPIDRequestById(created.id);

            expect(retrieved).not.toBeNull();
            expect(retrieved!.id).toEqual(created.id);
            expect(retrieved!.requester_name).toEqual('John Doe');
            expect(retrieved!.request_number).toEqual(created.request_number);
        });

        it('should return null for non-existent ID', async () => {
            const result = await getPPIDRequestById(999999);
            expect(result).toBeNull();
        });
    });

    describe('getPPIDRequestByNumber', () => {
        it('should retrieve a PPID request by request number', async () => {
            const created = await createPPIDRequest(testPPIDInput);
            const retrieved = await getPPIDRequestByNumber(created.request_number);

            expect(retrieved).not.toBeNull();
            expect(retrieved!.id).toEqual(created.id);
            expect(retrieved!.request_number).toEqual(created.request_number);
            expect(retrieved!.requester_name).toEqual('John Doe');
        });

        it('should return null for non-existent request number', async () => {
            const result = await getPPIDRequestByNumber('PPID-99999999-999999');
            expect(result).toBeNull();
        });
    });

    describe('updatePPIDRequest', () => {
        it('should update PPID request status', async () => {
            const created = await createPPIDRequest(testPPIDInput);
            const updated = await updatePPIDRequest(
                created.id, 
                'under_review'
            );

            expect(updated).not.toBeNull();
            expect(updated!.status).toEqual('under_review');
            expect(updated!.updated_at.getTime()).toBeGreaterThan(created.updated_at.getTime());
            expect(updated!.responded_at).toBeNull();
        });

        it('should update with response data and decision reason', async () => {
            const created = await createPPIDRequest(testPPIDInput);
            const responseData = 'Information provided as requested';
            const decisionReason = 'Request approved for academic research purposes';
            
            const updated = await updatePPIDRequest(
                created.id, 
                'approved',
                responseData,
                decisionReason
            );

            expect(updated).not.toBeNull();
            expect(updated!.status).toEqual('approved');
            expect(updated!.response_data).toEqual(responseData);
            expect(updated!.decision_reason).toEqual(decisionReason);
            expect(updated!.responded_at).toBeInstanceOf(Date);
            expect(updated!.responded_at!.getTime()).toBeGreaterThan(created.submitted_at.getTime());
        });

        it('should set responded_at for final statuses', async () => {
            const created = await createPPIDRequest(testPPIDInput);
            
            const finalStatuses: PPIDRequestStatus[] = ['approved', 'rejected', 'partially_approved'];
            
            for (const status of finalStatuses) {
                const testRequest = await createPPIDRequest({
                    ...testPPIDInput,
                    requester_email: `test-${status}@example.com`
                });
                
                const updated = await updatePPIDRequest(testRequest.id, status);
                
                expect(updated).not.toBeNull();
                expect(updated!.status).toEqual(status);
                expect(updated!.responded_at).toBeInstanceOf(Date);
            }
        });

        it('should return null for non-existent request', async () => {
            const result = await updatePPIDRequest(999999, 'approved');
            expect(result).toBeNull();
        });
    });

    describe('getPPIDRequests', () => {
        beforeEach(async () => {
            // Create multiple test requests with different statuses
            await createPPIDRequest({
                ...testPPIDInput,
                requester_email: 'test1@example.com'
            });
            
            const request2 = await createPPIDRequest({
                ...testPPIDInput,
                requester_email: 'test2@example.com'
            });
            await updatePPIDRequest(request2.id, 'under_review');
            
            const request3 = await createPPIDRequest({
                ...testPPIDInput,
                requester_email: 'test3@example.com'
            });
            await updatePPIDRequest(request3.id, 'approved');
        });

        it('should retrieve all PPID requests without filters', async () => {
            const requests = await getPPIDRequests();
            
            expect(requests).toHaveLength(3);
            expect(requests.every(r => r.requester_name === 'John Doe')).toBe(true);
        });

        it('should filter by status', async () => {
            const submittedRequests = await getPPIDRequests('submitted');
            const reviewRequests = await getPPIDRequests('under_review');
            const approvedRequests = await getPPIDRequests('approved');
            
            expect(submittedRequests).toHaveLength(1);
            expect(reviewRequests).toHaveLength(1);
            expect(approvedRequests).toHaveLength(1);
            
            expect(submittedRequests[0].status).toEqual('submitted');
            expect(reviewRequests[0].status).toEqual('under_review');
            expect(approvedRequests[0].status).toEqual('approved');
        });

        it('should filter by assigned user', async () => {
            const user = await createTestUser();
            const request = await createPPIDRequest({
                ...testPPIDInput,
                requester_email: 'assigned@example.com'
            });
            
            await assignPPIDRequest(request.id, user.id);
            
            const assignedRequests = await getPPIDRequests(undefined, user.id);
            const unassignedRequests = await getPPIDRequests(undefined, 999999);
            
            expect(assignedRequests).toHaveLength(1);
            expect(assignedRequests[0].assigned_to).toEqual(user.id);
            expect(unassignedRequests).toHaveLength(0);
        });

        it('should respect limit parameter', async () => {
            const requests = await getPPIDRequests(undefined, undefined, 2);
            expect(requests).toHaveLength(2);
        });

        it('should order by submission date (newest first)', async () => {
            const requests = await getPPIDRequests();
            
            expect(requests).toHaveLength(3);
            for (let i = 1; i < requests.length; i++) {
                expect(requests[i-1].submitted_at.getTime()).toBeGreaterThanOrEqual(
                    requests[i].submitted_at.getTime()
                );
            }
        });
    });

    describe('assignPPIDRequest', () => {
        it('should assign request to existing user', async () => {
            const user = await createTestUser();
            const request = await createPPIDRequest(testPPIDInput);
            
            const success = await assignPPIDRequest(request.id, user.id);
            expect(success).toBe(true);
            
            const updated = await getPPIDRequestById(request.id);
            expect(updated!.assigned_to).toEqual(user.id);
            expect(updated!.updated_at.getTime()).toBeGreaterThan(request.updated_at.getTime());
        });

        it('should return false for non-existent user', async () => {
            const request = await createPPIDRequest(testPPIDInput);
            
            const success = await assignPPIDRequest(request.id, 999999);
            expect(success).toBe(false);
        });

        it('should return false for non-existent request', async () => {
            const user = await createTestUser();
            
            const success = await assignPPIDRequest(999999, user.id);
            expect(success).toBe(false);
        });
    });

    describe('getPPIDStatistics', () => {
        beforeEach(async () => {
            // Create diverse test data for statistics
            const request1 = await createPPIDRequest({
                ...testPPIDInput,
                requester_email: 'stats1@example.com'
            });
            
            const request2 = await createPPIDRequest({
                ...testPPIDInput,
                requester_email: 'stats2@example.com'
            });
            await updatePPIDRequest(request2.id, 'under_review');
            
            const request3 = await createPPIDRequest({
                ...testPPIDInput,
                requester_email: 'stats3@example.com'
            });
            await updatePPIDRequest(request3.id, 'approved');
            
            const request4 = await createPPIDRequest({
                ...testPPIDInput,
                requester_email: 'stats4@example.com'
            });
            await updatePPIDRequest(request4.id, 'rejected');
        });

        it('should return correct statistics', async () => {
            const stats = await getPPIDStatistics();
            
            expect(stats.totalRequests).toEqual(4);
            expect(stats.pendingRequests).toEqual(2); // 1 submitted + 1 under_review
            expect(stats.approvedRequests).toEqual(1);
            expect(stats.rejectedRequests).toEqual(1);
            expect(typeof stats.averageResponseTime).toBe('number');
            expect(stats.averageResponseTime).toBeGreaterThanOrEqual(0);
        });

        it('should handle empty database', async () => {
            await resetDB();
            await createDB();
            
            const stats = await getPPIDStatistics();
            
            expect(stats.totalRequests).toEqual(0);
            expect(stats.pendingRequests).toEqual(0);
            expect(stats.approvedRequests).toEqual(0);
            expect(stats.rejectedRequests).toEqual(0);
            expect(stats.averageResponseTime).toEqual(0);
        });
    });
});