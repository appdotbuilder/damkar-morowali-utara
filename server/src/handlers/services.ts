import { db } from '../db';
import { serviceRequestsTable, usersTable } from '../db/schema';
import { eq, and, desc, SQL } from 'drizzle-orm';
import { 
    type CreateServiceRequestInput, 
    type UpdateServiceRequestInput,
    type ServiceRequest,
    type ServiceType,
    type ServiceStatus 
} from '../schema';

export async function createServiceRequest(input: CreateServiceRequestInput): Promise<ServiceRequest> {
    try {
        const ticketNumber = generateTicketNumber(input.type);
        
        const result = await db.insert(serviceRequestsTable)
            .values({
                ticket_number: ticketNumber,
                type: input.type,
                status: 'submitted',
                requester_name: input.requester_name,
                requester_email: input.requester_email,
                requester_phone: input.requester_phone,
                organization: input.organization || null,
                request_data: input.request_data,
                notes: input.notes || null,
                assigned_to: null
            })
            .returning()
            .execute();

        return {
            ...result[0],
            request_data: result[0].request_data as Record<string, any>
        };
    } catch (error) {
        console.error('Service request creation failed:', error);
        throw error;
    }
}

export async function getServiceRequestById(id: number): Promise<ServiceRequest | null> {
    try {
        const result = await db.select()
            .from(serviceRequestsTable)
            .where(eq(serviceRequestsTable.id, id))
            .execute();

        return result.length > 0 ? {
            ...result[0],
            request_data: result[0].request_data as Record<string, any>
        } : null;
    } catch (error) {
        console.error('Service request retrieval failed:', error);
        throw error;
    }
}

export async function getServiceRequestByTicket(ticketNumber: string): Promise<ServiceRequest | null> {
    try {
        const result = await db.select()
            .from(serviceRequestsTable)
            .where(eq(serviceRequestsTable.ticket_number, ticketNumber))
            .execute();

        return result.length > 0 ? {
            ...result[0],
            request_data: result[0].request_data as Record<string, any>
        } : null;
    } catch (error) {
        console.error('Service request retrieval by ticket failed:', error);
        throw error;
    }
}

export async function updateServiceRequest(input: UpdateServiceRequestInput): Promise<ServiceRequest | null> {
    try {
        const updateData: any = {
            updated_at: new Date()
        };

        if (input.status !== undefined) {
            updateData.status = input.status;
            if (input.status === 'completed') {
                updateData.completed_at = new Date();
            }
        }

        if (input.notes !== undefined) {
            updateData.notes = input.notes;
        }

        if (input.assigned_to !== undefined) {
            // Verify assignee exists if not null
            if (input.assigned_to !== null) {
                const assigneeExists = await db.select()
                    .from(usersTable)
                    .where(eq(usersTable.id, input.assigned_to))
                    .execute();
                
                if (assigneeExists.length === 0) {
                    throw new Error('Assignee does not exist');
                }
            }
            updateData.assigned_to = input.assigned_to;
        }

        const result = await db.update(serviceRequestsTable)
            .set(updateData)
            .where(eq(serviceRequestsTable.id, input.id))
            .returning()
            .execute();

        return result.length > 0 ? {
            ...result[0],
            request_data: result[0].request_data as Record<string, any>
        } : null;
    } catch (error) {
        console.error('Service request update failed:', error);
        throw error;
    }
}

export async function getServiceRequests(
    status?: ServiceStatus, 
    type?: ServiceType,
    assignedTo?: number,
    limit: number = 50
): Promise<ServiceRequest[]> {
    try {
        const conditions: SQL<unknown>[] = [];

        if (status !== undefined) {
            conditions.push(eq(serviceRequestsTable.status, status));
        }

        if (type !== undefined) {
            conditions.push(eq(serviceRequestsTable.type, type));
        }

        if (assignedTo !== undefined) {
            conditions.push(eq(serviceRequestsTable.assigned_to, assignedTo));
        }

        // Build the complete query in one chain
        const baseQuery = db.select().from(serviceRequestsTable);
        
        const finalQuery = conditions.length > 0
            ? baseQuery
                .where(conditions.length === 1 ? conditions[0] : and(...conditions))
                .orderBy(desc(serviceRequestsTable.submitted_at))
                .limit(limit)
            : baseQuery
                .orderBy(desc(serviceRequestsTable.submitted_at))
                .limit(limit);

        const results = await finalQuery.execute();
        
        return results.map(result => ({
            ...result,
            request_data: result.request_data as Record<string, any>
        }));
    } catch (error) {
        console.error('Service requests retrieval failed:', error);
        throw error;
    }
}

export async function assignServiceRequest(id: number, assigneeId: number): Promise<boolean> {
    try {
        // Verify assignee exists
        const assigneeExists = await db.select()
            .from(usersTable)
            .where(eq(usersTable.id, assigneeId))
            .execute();
        
        if (assigneeExists.length === 0) {
            throw new Error('Assignee does not exist');
        }

        const result = await db.update(serviceRequestsTable)
            .set({
                assigned_to: assigneeId,
                updated_at: new Date()
            })
            .where(eq(serviceRequestsTable.id, id))
            .returning()
            .execute();

        return result.length > 0;
    } catch (error) {
        console.error('Service request assignment failed:', error);
        throw error;
    }
}

function generateTicketNumber(type: ServiceType): string {
    const typePrefix = {
        'education_simulation': 'ES',
        'fire_protection_recommendation': 'FPR',
        'consultation_survey': 'CS',
        'non_emergency_complaint': 'NEC'
    };
    
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    return `${typePrefix[type]}-${year}${month}${day}-${hours}${minutes}${seconds}`;
}