import { db } from '../db';
import { emergencyContactsTable } from '../db/schema';
import { type EmergencyContact } from '../schema';
import { eq, and, desc, asc } from 'drizzle-orm';

export async function getEmergencyContacts(): Promise<EmergencyContact[]> {
    try {
        const results = await db.select()
            .from(emergencyContactsTable)
            .where(eq(emergencyContactsTable.is_active, true))
            .orderBy(asc(emergencyContactsTable.sort_order), asc(emergencyContactsTable.name))
            .execute();

        return results;
    } catch (error) {
        console.error('Failed to fetch emergency contacts:', error);
        throw error;
    }
}

export async function getPrimaryEmergencyContacts(): Promise<EmergencyContact[]> {
    try {
        const results = await db.select()
            .from(emergencyContactsTable)
            .where(and(
                eq(emergencyContactsTable.is_active, true),
                eq(emergencyContactsTable.is_primary, true)
            ))
            .orderBy(asc(emergencyContactsTable.sort_order), asc(emergencyContactsTable.name))
            .execute();

        return results;
    } catch (error) {
        console.error('Failed to fetch primary emergency contacts:', error);
        throw error;
    }
}

export async function createEmergencyContact(
    name: string,
    phoneNumber: string,
    whatsappNumber?: string,
    department?: string,
    isPrimary: boolean = false
): Promise<EmergencyContact> {
    try {
        // Get the next sort order by finding the max
        const maxOrderResult = await db.select()
            .from(emergencyContactsTable)
            .orderBy(desc(emergencyContactsTable.sort_order))
            .limit(1)
            .execute();

        const nextSortOrder = (maxOrderResult[0]?.sort_order ?? -1) + 1;

        const result = await db.insert(emergencyContactsTable)
            .values({
                name,
                phone_number: phoneNumber,
                whatsapp_number: whatsappNumber || null,
                department: department || null,
                is_primary: isPrimary,
                is_active: true,
                sort_order: nextSortOrder
            })
            .returning()
            .execute();

        return result[0];
    } catch (error) {
        console.error('Failed to create emergency contact:', error);
        throw error;
    }
}

export async function updateEmergencyContact(
    id: number,
    updates: {
        name?: string;
        phoneNumber?: string;
        whatsappNumber?: string;
        department?: string;
        isPrimary?: boolean;
        isActive?: boolean;
        sortOrder?: number;
    }
): Promise<EmergencyContact | null> {
    try {
        // First check if contact exists
        const existing = await db.select()
            .from(emergencyContactsTable)
            .where(eq(emergencyContactsTable.id, id))
            .execute();

        if (existing.length === 0) {
            return null;
        }

        // Build update object with only provided fields
        const updateData: any = {};
        
        if (updates.name !== undefined) updateData.name = updates.name;
        if (updates.phoneNumber !== undefined) updateData.phone_number = updates.phoneNumber;
        if (updates.whatsappNumber !== undefined) updateData.whatsapp_number = updates.whatsappNumber || null;
        if (updates.department !== undefined) updateData.department = updates.department || null;
        if (updates.isPrimary !== undefined) updateData.is_primary = updates.isPrimary;
        if (updates.isActive !== undefined) updateData.is_active = updates.isActive;
        if (updates.sortOrder !== undefined) updateData.sort_order = updates.sortOrder;

        const result = await db.update(emergencyContactsTable)
            .set(updateData)
            .where(eq(emergencyContactsTable.id, id))
            .returning()
            .execute();

        return result[0];
    } catch (error) {
        console.error('Failed to update emergency contact:', error);
        throw error;
    }
}

export async function deleteEmergencyContact(id: number): Promise<boolean> {
    try {
        // Safely deactivate instead of deleting for audit trail
        const result = await db.update(emergencyContactsTable)
            .set({ is_active: false })
            .where(eq(emergencyContactsTable.id, id))
            .returning()
            .execute();

        return result.length > 0;
    } catch (error) {
        console.error('Failed to deactivate emergency contact:', error);
        throw error;
    }
}

export async function reorderEmergencyContacts(contactOrders: { id: number; sortOrder: number }[]): Promise<boolean> {
    try {
        // Update all contacts in the array with their new sort orders
        for (const { id, sortOrder } of contactOrders) {
            await db.update(emergencyContactsTable)
                .set({ sort_order: sortOrder })
                .where(eq(emergencyContactsTable.id, id))
                .execute();
        }

        return true;
    } catch (error) {
        console.error('Failed to reorder emergency contacts:', error);
        throw error;
    }
}

export async function logEmergencyAccess(contactId: number, accessMethod: 'phone' | 'whatsapp'): Promise<void> {
    try {
        // For now, just log to console - in production this would go to an audit/analytics table
        console.log(`Emergency contact accessed: contactId=${contactId}, method=${accessMethod}, timestamp=${new Date().toISOString()}`);
        
        // Note: This is a simplified implementation. In a real system, you would:
        // 1. Create an emergency_access_logs table
        // 2. Insert the access record with timestamp, IP address, user agent, etc.
        // 3. Potentially trigger alerts or notifications for emergency service usage analytics
        
        return Promise.resolve();
    } catch (error) {
        console.error('Failed to log emergency access:', error);
        throw error;
    }
}