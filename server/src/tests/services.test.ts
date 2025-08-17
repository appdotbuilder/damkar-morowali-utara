import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { serviceRequestsTable, usersTable } from '../db/schema';
import { eq } from 'drizzle-orm';
import { 
    type CreateServiceRequestInput,
    type UpdateServiceRequestInput
} from '../schema';
import {
    createServiceRequest,
    getServiceRequestById,
    getServiceRequestByTicket,
    updateServiceRequest,
    getServiceRequests,
    assignServiceRequest
} from '../handlers/services';

// Test data
const testUser = {
    username: 'testuser',
    email: 'test@example.com',
    password_hash: 'hashedpassword',
    full_name: 'Test User',
    role: 'service_officer' as const
};

const testServiceRequestInput: CreateServiceRequestInput = {
    type: 'education_simulation',
    requester_name: 'John Doe',
    requester_email: 'john.doe@example.com',
    requester_phone: '+1234567890',
    organization: 'Test Organization',
    request_data: {
        location: 'Test Building',
        participants: 50,
        preferred_date: '2024-03-15'
    },
    notes: 'Initial request notes'
};

describe('Service Request Handlers', () => {
    beforeEach(createDB);
    afterEach(resetDB);

    describe('createServiceRequest', () => {
        it('should create a service request successfully', async () => {
            const result = await createServiceRequest(testServiceRequestInput);

            expect(result.id).toBeDefined();
            expect(result.ticket_number).toBeDefined();
            expect(result.ticket_number).toMatch(/^ES-\d{8}-\d{6}$/);
            expect(result.type).toEqual('education_simulation');
            expect(result.status).toEqual('submitted');
            expect(result.requester_name).toEqual('John Doe');
            expect(result.requester_email).toEqual('john.doe@example.com');
            expect(result.requester_phone).toEqual('+1234567890');
            expect(result.organization).toEqual('Test Organization');
            expect(result.request_data).toEqual(testServiceRequestInput.request_data);
            expect(result.notes).toEqual('Initial request notes');
            expect(result.assigned_to).toBeNull();
            expect(result.submitted_at).toBeInstanceOf(Date);
            expect(result.updated_at).toBeInstanceOf(Date);
            expect(result.completed_at).toBeNull();
        });

        it('should generate different ticket numbers for different service types', async () => {
            const educationRequest = await createServiceRequest({
                ...testServiceRequestInput,
                type: 'education_simulation'
            });

            const consultationRequest = await createServiceRequest({
                ...testServiceRequestInput,
                type: 'consultation_survey'
            });

            expect(educationRequest.ticket_number).toMatch(/^ES-/);
            expect(consultationRequest.ticket_number).toMatch(/^CS-/);
            expect(educationRequest.ticket_number).not.toEqual(consultationRequest.ticket_number);
        });

        it('should handle optional fields correctly', async () => {
            const minimalInput: CreateServiceRequestInput = {
                type: 'fire_protection_recommendation',
                requester_name: 'Jane Smith',
                requester_email: 'jane@example.com',
                requester_phone: '+0987654321',
                request_data: { building_type: 'residential' }
            };

            const result = await createServiceRequest(minimalInput);

            expect(result.organization).toBeNull();
            expect(result.notes).toBeNull();
            expect(result.ticket_number).toMatch(/^FPR-/);
        });

        it('should save service request to database', async () => {
            const result = await createServiceRequest(testServiceRequestInput);

            const saved = await db.select()
                .from(serviceRequestsTable)
                .where(eq(serviceRequestsTable.id, result.id))
                .execute();

            expect(saved).toHaveLength(1);
            expect(saved[0].requester_name).toEqual('John Doe');
            expect(saved[0].type).toEqual('education_simulation');
            expect(saved[0].status).toEqual('submitted');
        });
    });

    describe('getServiceRequestById', () => {
        it('should retrieve a service request by ID', async () => {
            const created = await createServiceRequest(testServiceRequestInput);
            const retrieved = await getServiceRequestById(created.id);

            expect(retrieved).not.toBeNull();
            expect(retrieved!.id).toEqual(created.id);
            expect(retrieved!.requester_name).toEqual('John Doe');
            expect(retrieved!.type).toEqual('education_simulation');
        });

        it('should return null for non-existent ID', async () => {
            const result = await getServiceRequestById(99999);
            expect(result).toBeNull();
        });
    });

    describe('getServiceRequestByTicket', () => {
        it('should retrieve a service request by ticket number', async () => {
            const created = await createServiceRequest(testServiceRequestInput);
            const retrieved = await getServiceRequestByTicket(created.ticket_number);

            expect(retrieved).not.toBeNull();
            expect(retrieved!.id).toEqual(created.id);
            expect(retrieved!.ticket_number).toEqual(created.ticket_number);
            expect(retrieved!.requester_name).toEqual('John Doe');
        });

        it('should return null for non-existent ticket', async () => {
            const result = await getServiceRequestByTicket('INVALID-12345678-123456');
            expect(result).toBeNull();
        });
    });

    describe('updateServiceRequest', () => {
        let testUserId: number;
        let serviceRequestId: number;

        beforeEach(async () => {
            // Create test user first
            const userResult = await db.insert(usersTable)
                .values(testUser)
                .returning()
                .execute();
            testUserId = userResult[0].id;

            // Create service request
            const serviceRequest = await createServiceRequest(testServiceRequestInput);
            serviceRequestId = serviceRequest.id;
        });

        it('should update service request status', async () => {
            const updateInput: UpdateServiceRequestInput = {
                id: serviceRequestId,
                status: 'in_progress'
            };

            const result = await updateServiceRequest(updateInput);

            expect(result).not.toBeNull();
            expect(result!.status).toEqual('in_progress');
            expect(result!.updated_at).toBeInstanceOf(Date);
            expect(result!.completed_at).toBeNull();
        });

        it('should set completed_at when status is completed', async () => {
            const updateInput: UpdateServiceRequestInput = {
                id: serviceRequestId,
                status: 'completed'
            };

            const result = await updateServiceRequest(updateInput);

            expect(result).not.toBeNull();
            expect(result!.status).toEqual('completed');
            expect(result!.completed_at).toBeInstanceOf(Date);
        });

        it('should update notes', async () => {
            const updateInput: UpdateServiceRequestInput = {
                id: serviceRequestId,
                notes: 'Updated notes'
            };

            const result = await updateServiceRequest(updateInput);

            expect(result).not.toBeNull();
            expect(result!.notes).toEqual('Updated notes');
        });

        it('should assign to user', async () => {
            const updateInput: UpdateServiceRequestInput = {
                id: serviceRequestId,
                assigned_to: testUserId
            };

            const result = await updateServiceRequest(updateInput);

            expect(result).not.toBeNull();
            expect(result!.assigned_to).toEqual(testUserId);
        });

        it('should throw error for invalid assignee', async () => {
            const updateInput: UpdateServiceRequestInput = {
                id: serviceRequestId,
                assigned_to: 99999
            };

            await expect(updateServiceRequest(updateInput)).rejects.toThrow(/Assignee does not exist/i);
        });

        it('should return null for non-existent service request', async () => {
            const updateInput: UpdateServiceRequestInput = {
                id: 99999,
                status: 'completed'
            };

            const result = await updateServiceRequest(updateInput);
            expect(result).toBeNull();
        });
    });

    describe('getServiceRequests', () => {
        beforeEach(async () => {
            // Create multiple service requests with different statuses and types
            await createServiceRequest({
                ...testServiceRequestInput,
                type: 'education_simulation'
            });

            await createServiceRequest({
                ...testServiceRequestInput,
                type: 'consultation_survey',
                requester_name: 'Jane Smith'
            });

            // Create one with different status
            const request = await createServiceRequest({
                ...testServiceRequestInput,
                type: 'fire_protection_recommendation',
                requester_name: 'Bob Johnson'
            });

            await db.update(serviceRequestsTable)
                .set({ status: 'in_progress' })
                .where(eq(serviceRequestsTable.id, request.id))
                .execute();
        });

        it('should retrieve all service requests', async () => {
            const result = await getServiceRequests();

            expect(result).toHaveLength(3);
            expect(result[0].submitted_at >= result[1].submitted_at).toBe(true); // Ordered by submitted_at desc
        });

        it('should filter by status', async () => {
            const result = await getServiceRequests('in_progress');

            expect(result).toHaveLength(1);
            expect(result[0].status).toEqual('in_progress');
            expect(result[0].requester_name).toEqual('Bob Johnson');
        });

        it('should filter by type', async () => {
            const result = await getServiceRequests(undefined, 'education_simulation');

            expect(result).toHaveLength(1);
            expect(result[0].type).toEqual('education_simulation');
            expect(result[0].requester_name).toEqual('John Doe');
        });

        it('should filter by multiple criteria', async () => {
            const result = await getServiceRequests('submitted', 'consultation_survey');

            expect(result).toHaveLength(1);
            expect(result[0].status).toEqual('submitted');
            expect(result[0].type).toEqual('consultation_survey');
            expect(result[0].requester_name).toEqual('Jane Smith');
        });

        it('should respect limit parameter', async () => {
            const result = await getServiceRequests(undefined, undefined, undefined, 2);

            expect(result).toHaveLength(2);
        });
    });

    describe('assignServiceRequest', () => {
        let testUserId: number;
        let serviceRequestId: number;

        beforeEach(async () => {
            // Create test user
            const userResult = await db.insert(usersTable)
                .values(testUser)
                .returning()
                .execute();
            testUserId = userResult[0].id;

            // Create service request
            const serviceRequest = await createServiceRequest(testServiceRequestInput);
            serviceRequestId = serviceRequest.id;
        });

        it('should assign service request to user', async () => {
            const result = await assignServiceRequest(serviceRequestId, testUserId);

            expect(result).toBe(true);

            // Verify assignment in database
            const updated = await getServiceRequestById(serviceRequestId);
            expect(updated!.assigned_to).toEqual(testUserId);
        });

        it('should throw error for invalid assignee', async () => {
            await expect(assignServiceRequest(serviceRequestId, 99999))
                .rejects.toThrow(/Assignee does not exist/i);
        });

        it('should return false for non-existent service request', async () => {
            const result = await assignServiceRequest(99999, testUserId);
            expect(result).toBe(false);
        });
    });
});