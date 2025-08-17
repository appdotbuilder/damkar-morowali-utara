import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { emergencyContactsTable } from '../db/schema';
import {
    getEmergencyContacts,
    getPrimaryEmergencyContacts,
    createEmergencyContact,
    updateEmergencyContact,
    deleteEmergencyContact,
    reorderEmergencyContacts,
    logEmergencyAccess
} from '../handlers/emergency';
import { eq } from 'drizzle-orm';

describe('Emergency Contact Handlers', () => {
    beforeEach(createDB);
    afterEach(resetDB);

    describe('createEmergencyContact', () => {
        it('should create an emergency contact with all fields', async () => {
            const result = await createEmergencyContact(
                'Fire Department',
                '113',
                '081234567890',
                'Emergency Response',
                true
            );

            expect(result.id).toBeDefined();
            expect(result.name).toBe('Fire Department');
            expect(result.phone_number).toBe('113');
            expect(result.whatsapp_number).toBe('081234567890');
            expect(result.department).toBe('Emergency Response');
            expect(result.is_primary).toBe(true);
            expect(result.is_active).toBe(true);
            expect(result.sort_order).toBe(0);
            expect(result.created_at).toBeInstanceOf(Date);
        });

        it('should create an emergency contact with minimal fields', async () => {
            const result = await createEmergencyContact(
                'Police Hotline',
                '110'
            );

            expect(result.name).toBe('Police Hotline');
            expect(result.phone_number).toBe('110');
            expect(result.whatsapp_number).toBeNull();
            expect(result.department).toBeNull();
            expect(result.is_primary).toBe(false);
            expect(result.is_active).toBe(true);
        });

        it('should assign incremental sort order', async () => {
            const first = await createEmergencyContact('First Contact', '111');
            const second = await createEmergencyContact('Second Contact', '112');
            const third = await createEmergencyContact('Third Contact', '113');

            expect(first.sort_order).toBe(0);
            expect(second.sort_order).toBe(1);
            expect(third.sort_order).toBe(2);
        });

        it('should save contact to database', async () => {
            const result = await createEmergencyContact('Test Contact', '123456789');

            const contacts = await db.select()
                .from(emergencyContactsTable)
                .where(eq(emergencyContactsTable.id, result.id))
                .execute();

            expect(contacts).toHaveLength(1);
            expect(contacts[0].name).toBe('Test Contact');
            expect(contacts[0].phone_number).toBe('123456789');
        });
    });

    describe('getEmergencyContacts', () => {
        beforeEach(async () => {
            // Create test contacts
            await createEmergencyContact('Fire Department', '113', undefined, 'Emergency', true);
            await createEmergencyContact('Police', '110', '081234567890', 'Law Enforcement', true);
            await createEmergencyContact('Medical Emergency', '119', undefined, 'Health', false);
            
            // Create an inactive contact
            const inactive = await createEmergencyContact('Inactive Service', '999');
            await updateEmergencyContact(inactive.id, { isActive: false });
        });

        it('should return all active emergency contacts', async () => {
            const contacts = await getEmergencyContacts();

            expect(contacts).toHaveLength(3);
            expect(contacts.every(c => c.is_active)).toBe(true);
        });

        it('should return contacts sorted by sort_order then name', async () => {
            const contacts = await getEmergencyContacts();

            // Should be sorted by sort_order (0, 1, 2) then by name
            expect(contacts[0].name).toBe('Fire Department');
            expect(contacts[1].name).toBe('Police');
            expect(contacts[2].name).toBe('Medical Emergency');
        });

        it('should exclude inactive contacts', async () => {
            const contacts = await getEmergencyContacts();
            
            const hasInactiveService = contacts.some(c => c.name === 'Inactive Service');
            expect(hasInactiveService).toBe(false);
        });
    });

    describe('getPrimaryEmergencyContacts', () => {
        beforeEach(async () => {
            await createEmergencyContact('Fire Department', '113', undefined, 'Emergency', true);
            await createEmergencyContact('Police', '110', undefined, 'Law Enforcement', true);
            await createEmergencyContact('General Info', '411', undefined, 'Information', false);
        });

        it('should return only primary emergency contacts', async () => {
            const contacts = await getPrimaryEmergencyContacts();

            expect(contacts).toHaveLength(2);
            expect(contacts.every(c => c.is_primary)).toBe(true);
            
            const names = contacts.map(c => c.name);
            expect(names).toContain('Fire Department');
            expect(names).toContain('Police');
            expect(names).not.toContain('General Info');
        });

        it('should return contacts sorted properly', async () => {
            const contacts = await getPrimaryEmergencyContacts();

            expect(contacts[0].name).toBe('Fire Department');
            expect(contacts[1].name).toBe('Police');
        });
    });

    describe('updateEmergencyContact', () => {
        let contactId: number;

        beforeEach(async () => {
            const contact = await createEmergencyContact('Test Contact', '123');
            contactId = contact.id;
        });

        it('should update all provided fields', async () => {
            const result = await updateEmergencyContact(contactId, {
                name: 'Updated Contact',
                phoneNumber: '456',
                whatsappNumber: '081234567890',
                department: 'New Department',
                isPrimary: true,
                isActive: false,
                sortOrder: 10
            });

            expect(result).not.toBeNull();
            expect(result!.name).toBe('Updated Contact');
            expect(result!.phone_number).toBe('456');
            expect(result!.whatsapp_number).toBe('081234567890');
            expect(result!.department).toBe('New Department');
            expect(result!.is_primary).toBe(true);
            expect(result!.is_active).toBe(false);
            expect(result!.sort_order).toBe(10);
        });

        it('should update only provided fields', async () => {
            const original = await createEmergencyContact('Original', '123', '999', 'Dept', true);
            
            const result = await updateEmergencyContact(original.id, {
                name: 'Updated Name'
            });

            expect(result!.name).toBe('Updated Name');
            expect(result!.phone_number).toBe('123');
            expect(result!.whatsapp_number).toBe('999');
            expect(result!.department).toBe('Dept');
            expect(result!.is_primary).toBe(true);
        });

        it('should handle null values for optional fields', async () => {
            const result = await updateEmergencyContact(contactId, {
                whatsappNumber: '',
                department: ''
            });

            expect(result!.whatsapp_number).toBeNull();
            expect(result!.department).toBeNull();
        });

        it('should return null for non-existent contact', async () => {
            const result = await updateEmergencyContact(99999, { name: 'Test' });
            expect(result).toBeNull();
        });

        it('should persist changes to database', async () => {
            await updateEmergencyContact(contactId, { name: 'Updated in DB' });

            const contacts = await db.select()
                .from(emergencyContactsTable)
                .where(eq(emergencyContactsTable.id, contactId))
                .execute();

            expect(contacts[0].name).toBe('Updated in DB');
        });
    });

    describe('deleteEmergencyContact', () => {
        let contactId: number;

        beforeEach(async () => {
            const contact = await createEmergencyContact('To Delete', '123');
            contactId = contact.id;
        });

        it('should deactivate emergency contact', async () => {
            const result = await deleteEmergencyContact(contactId);
            expect(result).toBe(true);

            const contacts = await db.select()
                .from(emergencyContactsTable)
                .where(eq(emergencyContactsTable.id, contactId))
                .execute();

            expect(contacts[0].is_active).toBe(false);
        });

        it('should return false for non-existent contact', async () => {
            const result = await deleteEmergencyContact(99999);
            expect(result).toBe(false);
        });

        it('should preserve contact data for audit trail', async () => {
            await deleteEmergencyContact(contactId);

            const contacts = await db.select()
                .from(emergencyContactsTable)
                .where(eq(emergencyContactsTable.id, contactId))
                .execute();

            // Contact should still exist but be inactive
            expect(contacts).toHaveLength(1);
            expect(contacts[0].name).toBe('To Delete');
            expect(contacts[0].is_active).toBe(false);
        });
    });

    describe('reorderEmergencyContacts', () => {
        let contactIds: number[];

        beforeEach(async () => {
            const first = await createEmergencyContact('First', '111');
            const second = await createEmergencyContact('Second', '222');
            const third = await createEmergencyContact('Third', '333');
            contactIds = [first.id, second.id, third.id];
        });

        it('should update sort orders for all contacts', async () => {
            const reorderData = [
                { id: contactIds[0], sortOrder: 10 },
                { id: contactIds[1], sortOrder: 5 },
                { id: contactIds[2], sortOrder: 15 }
            ];

            const result = await reorderEmergencyContacts(reorderData);
            expect(result).toBe(true);

            // Verify sort orders were updated
            const contacts = await db.select()
                .from(emergencyContactsTable)
                .execute();

            const sortedContacts = contacts.sort((a, b) => a.id - b.id);
            expect(sortedContacts[0].sort_order).toBe(10);
            expect(sortedContacts[1].sort_order).toBe(5);
            expect(sortedContacts[2].sort_order).toBe(15);
        });

        it('should affect display order in getEmergencyContacts', async () => {
            // Reorder so third becomes first
            await reorderEmergencyContacts([
                { id: contactIds[0], sortOrder: 10 },
                { id: contactIds[1], sortOrder: 20 },
                { id: contactIds[2], sortOrder: 5 }
            ]);

            const contacts = await getEmergencyContacts();
            expect(contacts[0].name).toBe('Third');
            expect(contacts[1].name).toBe('First');
            expect(contacts[2].name).toBe('Second');
        });
    });

    describe('logEmergencyAccess', () => {
        it('should log emergency access without throwing error', async () => {
            const contact = await createEmergencyContact('Emergency Service', '911');
            
            // Should complete without throwing
            await expect(logEmergencyAccess(contact.id, 'phone')).resolves.toBeUndefined();
            await expect(logEmergencyAccess(contact.id, 'whatsapp')).resolves.toBeUndefined();
        });

        it('should handle invalid contact id gracefully', async () => {
            // Should not throw even for invalid contact ID
            await expect(logEmergencyAccess(99999, 'phone')).resolves.toBeUndefined();
        });
    });
});