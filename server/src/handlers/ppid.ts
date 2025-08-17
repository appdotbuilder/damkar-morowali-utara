import { db } from '../db';
import { ppidRequestsTable, usersTable } from '../db/schema';
import { 
    type CreatePPIDRequestInput, 
    type PPIDRequest,
    type PPIDRequestStatus 
} from '../schema';
import { eq, and, SQL, desc, count } from 'drizzle-orm';

export async function createPPIDRequest(input: CreatePPIDRequestInput): Promise<PPIDRequest> {
    try {
        let requestNumber = generatePPIDRequestNumber();
        let attempts = 0;
        const maxAttempts = 10;
        
        // Retry logic in case of duplicate request number
        while (attempts < maxAttempts) {
            try {
                const result = await db.insert(ppidRequestsTable)
                    .values({
                        request_number: requestNumber,
                        requester_name: input.requester_name,
                        requester_email: input.requester_email,
                        requester_phone: input.requester_phone,
                        id_number: input.id_number,
                        information_requested: input.information_requested,
                        purpose: input.purpose,
                        status: 'submitted'
                    })
                    .returning()
                    .execute();

                return result[0];
            } catch (insertError: any) {
                // If it's a duplicate key error, generate a new number and retry
                if (insertError?.code === '23505' && insertError?.constraint?.includes('request_number')) {
                    attempts++;
                    requestNumber = generatePPIDRequestNumber();
                    continue;
                }
                // If it's any other error, throw immediately
                throw insertError;
            }
        }
        
        throw new Error(`Failed to generate unique request number after ${maxAttempts} attempts`);
    } catch (error) {
        console.error('PPID request creation failed:', error);
        throw error;
    }
}

export async function getPPIDRequestById(id: number): Promise<PPIDRequest | null> {
    try {
        const result = await db.select()
            .from(ppidRequestsTable)
            .where(eq(ppidRequestsTable.id, id))
            .execute();

        return result.length > 0 ? result[0] : null;
    } catch (error) {
        console.error('Failed to get PPID request by ID:', error);
        throw error;
    }
}

export async function getPPIDRequestByNumber(requestNumber: string): Promise<PPIDRequest | null> {
    try {
        const result = await db.select()
            .from(ppidRequestsTable)
            .where(eq(ppidRequestsTable.request_number, requestNumber))
            .execute();

        return result.length > 0 ? result[0] : null;
    } catch (error) {
        console.error('Failed to get PPID request by number:', error);
        throw error;
    }
}

export async function updatePPIDRequest(
    id: number, 
    status: PPIDRequestStatus,
    responseData?: string,
    decisionReason?: string
): Promise<PPIDRequest | null> {
    try {
        // Check if the request exists
        const existingRequest = await getPPIDRequestById(id);
        if (!existingRequest) {
            return null;
        }

        const updateData: any = {
            status,
            updated_at: new Date()
        };

        // Add optional fields if provided
        if (responseData !== undefined) {
            updateData.response_data = responseData;
        }

        if (decisionReason !== undefined) {
            updateData.decision_reason = decisionReason;
        }

        // Set responded_at timestamp for final statuses
        if (['approved', 'rejected', 'partially_approved'].includes(status)) {
            updateData.responded_at = new Date();
        }

        const result = await db.update(ppidRequestsTable)
            .set(updateData)
            .where(eq(ppidRequestsTable.id, id))
            .returning()
            .execute();

        return result[0];
    } catch (error) {
        console.error('Failed to update PPID request:', error);
        throw error;
    }
}

export async function getPPIDRequests(
    status?: PPIDRequestStatus,
    assignedTo?: number,
    limit: number = 50
): Promise<PPIDRequest[]> {
    try {
        // Build conditions array
        const conditions: SQL<unknown>[] = [];

        if (status) {
            conditions.push(eq(ppidRequestsTable.status, status));
        }

        if (assignedTo !== undefined) {
            conditions.push(eq(ppidRequestsTable.assigned_to, assignedTo));
        }

        // Build query step by step to maintain proper types
        let baseQuery = db.select().from(ppidRequestsTable);

        // Apply where clause if there are conditions
        let filteredQuery = conditions.length > 0
            ? baseQuery.where(conditions.length === 1 ? conditions[0] : and(...conditions))
            : baseQuery;

        // Apply ordering and limit in final step
        const result = await filteredQuery
            .orderBy(desc(ppidRequestsTable.submitted_at))
            .limit(limit)
            .execute();

        return result;
    } catch (error) {
        console.error('Failed to get PPID requests:', error);
        throw error;
    }
}

export async function assignPPIDRequest(id: number, assigneeId: number): Promise<boolean> {
    try {
        // Check if the assignee exists
        const assigneeExists = await db.select()
            .from(usersTable)
            .where(eq(usersTable.id, assigneeId))
            .execute();

        if (assigneeExists.length === 0) {
            return false;
        }

        // Check if the request exists
        const requestExists = await getPPIDRequestById(id);
        if (!requestExists) {
            return false;
        }

        const result = await db.update(ppidRequestsTable)
            .set({
                assigned_to: assigneeId,
                updated_at: new Date()
            })
            .where(eq(ppidRequestsTable.id, id))
            .execute();

        return (result.rowCount || 0) > 0;
    } catch (error) {
        console.error('Failed to assign PPID request:', error);
        throw error;
    }
}

export async function getPPIDStatistics(): Promise<{
    totalRequests: number;
    pendingRequests: number;
    approvedRequests: number;
    rejectedRequests: number;
    averageResponseTime: number;
}> {
    try {
        // Get total requests
        const totalResult = await db.select({ count: count() })
            .from(ppidRequestsTable)
            .execute();
        
        const totalRequests = totalResult[0]?.count || 0;

        // Get pending requests (submitted, under_review)
        const submittedResult = await db.select({ count: count() })
            .from(ppidRequestsTable)
            .where(eq(ppidRequestsTable.status, 'submitted'))
            .execute();
            
        const underReviewResult = await db.select({ count: count() })
            .from(ppidRequestsTable)
            .where(eq(ppidRequestsTable.status, 'under_review'))
            .execute();
        
        const pendingRequests = (submittedResult[0]?.count || 0) + (underReviewResult[0]?.count || 0);

        // Get approved requests
        const approvedResult = await db.select({ count: count() })
            .from(ppidRequestsTable)
            .where(eq(ppidRequestsTable.status, 'approved'))
            .execute();
        
        const approvedRequests = approvedResult[0]?.count || 0;

        // Get rejected requests
        const rejectedResult = await db.select({ count: count() })
            .from(ppidRequestsTable)
            .where(eq(ppidRequestsTable.status, 'rejected'))
            .execute();
        
        const rejectedRequests = rejectedResult[0]?.count || 0;

        // Calculate average response time for completed requests
        const completedRequestsApproved = await db.select()
            .from(ppidRequestsTable)
            .where(eq(ppidRequestsTable.status, 'approved'))
            .execute();
            
        const completedRequestsRejected = await db.select()
            .from(ppidRequestsTable)
            .where(eq(ppidRequestsTable.status, 'rejected'))
            .execute();
            
        const completedRequestsPartial = await db.select()
            .from(ppidRequestsTable)
            .where(eq(ppidRequestsTable.status, 'partially_approved'))
            .execute();
            
        const completedRequests = [
            ...completedRequestsApproved,
            ...completedRequestsRejected,
            ...completedRequestsPartial
        ];

        let averageResponseTime = 0;
        if (completedRequests.length > 0) {
            const totalResponseTime = completedRequests.reduce((total, request) => {
                if (request.responded_at && request.submitted_at) {
                    const responseTime = request.responded_at.getTime() - request.submitted_at.getTime();
                    return total + responseTime;
                }
                return total;
            }, 0);
            
            averageResponseTime = Math.round(totalResponseTime / completedRequests.length / (1000 * 60 * 60 * 24)); // Convert to days
        }

        return {
            totalRequests,
            pendingRequests,
            approvedRequests,
            rejectedRequests,
            averageResponseTime
        };
    } catch (error) {
        console.error('Failed to get PPID statistics:', error);
        throw error;
    }
}

// Counter for ensuring uniqueness within the same millisecond
let requestCounter = 0;

function generatePPIDRequestNumber(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const milliseconds = String(now.getMilliseconds()).padStart(3, '0');
    
    // Increment counter for uniqueness within same timestamp
    requestCounter = (requestCounter + 1) % 1000;
    const counter = String(requestCounter).padStart(3, '0');
    
    // Use high-resolution timestamp + counter for maximum uniqueness
    const sequence = `${hours}${minutes}${seconds}${milliseconds}${counter}`.slice(0, 9);
    
    return `PPID-${year}${month}${day}-${sequence}`;
}