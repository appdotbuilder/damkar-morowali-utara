import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { datasetsTable, usersTable } from '../db/schema';
import { uploadDataset } from '../handlers/datasets';
import { eq } from 'drizzle-orm';

const testUser = {
    username: 'testuser',
    email: 'test@example.com',
    password_hash: 'hashedpassword123',
    full_name: 'Test User',
    role: 'editor' as const
};

const testFile = {
    filename: 'fire_incidents_2024.csv',
    buffer: Buffer.from('year,incidents,casualties\n2024,150,5\n2023,120,3'),
    mimeType: 'text/csv'
};

describe('uploadDataset', () => {
    let testUserId: number;

    beforeEach(async () => {
        await createDB();
        
        // Create test user
        const users = await db.insert(usersTable)
            .values(testUser)
            .returning()
            .execute();
        
        testUserId = users[0].id;
    });

    afterEach(resetDB);

    it('should upload a dataset with all required fields', async () => {
        const result = await uploadDataset(
            'Fire Incidents 2024',
            testFile,
            testUserId,
            '2024',
            'Annual fire incident statistics'
        );

        // Verify returned dataset structure
        expect(result.id).toBeDefined();
        expect(result.title).toEqual('Fire Incidents 2024');
        expect(result.description).toEqual('Annual fire incident statistics');
        expect(result.file_type).toEqual('CSV');
        expect(result.period).toEqual('2024');
        expect(result.uploaded_by).toEqual(testUserId);
        expect(result.is_public).toEqual(true);
        expect(result.created_at).toBeInstanceOf(Date);
        expect(result.file_path).toMatch(/^\/datasets\/\d+_fire_incidents_2024\.csv$/);
    });

    it('should save dataset to database', async () => {
        const result = await uploadDataset(
            'Emergency Response Data',
            testFile,
            testUserId,
            '2024-Q1'
        );

        // Verify database record
        const datasets = await db.select()
            .from(datasetsTable)
            .where(eq(datasetsTable.id, result.id))
            .execute();

        expect(datasets).toHaveLength(1);
        const dataset = datasets[0];
        expect(dataset.title).toEqual('Emergency Response Data');
        expect(dataset.file_type).toEqual('CSV');
        expect(dataset.period).toEqual('2024-Q1');
        expect(dataset.uploaded_by).toEqual(testUserId);
        expect(dataset.is_public).toEqual(true);
        expect(dataset.created_at).toBeInstanceOf(Date);
    });

    it('should handle optional description parameter', async () => {
        const result = await uploadDataset(
            'Basic Dataset',
            testFile,
            testUserId,
            '2024'
        );

        expect(result.description).toBeNull();
    });

    it('should handle isPublic parameter correctly', async () => {
        const result = await uploadDataset(
            'Internal Report',
            testFile,
            testUserId,
            '2024',
            'Confidential data',
            false
        );

        expect(result.is_public).toEqual(false);
        
        // Verify in database
        const datasets = await db.select()
            .from(datasetsTable)
            .where(eq(datasetsTable.id, result.id))
            .execute();
        
        expect(datasets[0].is_public).toEqual(false);
    });

    it('should determine correct file type from MIME type', async () => {
        const excelFile = {
            filename: 'data.xlsx',
            buffer: Buffer.from('mock excel data'),
            mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        };

        const result = await uploadDataset(
            'Excel Dataset',
            excelFile,
            testUserId,
            '2024'
        );

        expect(result.file_type).toEqual('Excel');
    });

    it('should handle various file types correctly', async () => {
        const testCases = [
            { mimeType: 'text/csv', expected: 'CSV' },
            { mimeType: 'application/vnd.ms-excel', expected: 'Excel' },
            { mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', expected: 'Excel' },
            { mimeType: 'application/json', expected: 'JSON' },
            { mimeType: 'application/pdf', expected: 'PDF' },
            { mimeType: 'text/plain', expected: 'Unknown' }
        ];

        for (const testCase of testCases) {
            const file = {
                filename: `test.file`,
                buffer: Buffer.from('test data'),
                mimeType: testCase.mimeType
            };

            const result = await uploadDataset(
                `Test ${testCase.expected}`,
                file,
                testUserId,
                '2024'
            );

            expect(result.file_type).toEqual(testCase.expected);
        }
    });

    it('should generate unique file paths', async () => {
        const file1 = {
            filename: 'same_name.csv',
            buffer: Buffer.from('data1'),
            mimeType: 'text/csv'
        };

        const file2 = {
            filename: 'same_name.csv',
            buffer: Buffer.from('data2'),
            mimeType: 'text/csv'
        };

        const result1 = await uploadDataset('Dataset 1', file1, testUserId, '2024');
        const result2 = await uploadDataset('Dataset 2', file2, testUserId, '2024');

        expect(result1.file_path).not.toEqual(result2.file_path);
        expect(result1.file_path).toMatch(/\/datasets\/\d+_same_name\.csv$/);
        expect(result2.file_path).toMatch(/\/datasets\/\d+_same_name\.csv$/);
    });

    it('should throw error for non-existent uploader', async () => {
        const nonExistentUserId = 99999;

        expect(
            uploadDataset(
                'Test Dataset',
                testFile,
                nonExistentUserId,
                '2024'
            )
        ).rejects.toThrow(/uploader user not found/i);
    });

    it('should handle database errors gracefully', async () => {
        // Create a dataset upload that would violate database constraints
        // by using an extremely long title that exceeds VARCHAR limits
        const longTitle = 'x'.repeat(300); // Assuming title has VARCHAR(255) limit

        expect(
            uploadDataset(
                longTitle,
                testFile,
                testUserId,
                '2024'
            )
        ).rejects.toThrow();
    });

    it('should verify all dataset fields are properly stored', async () => {
        const testData = {
            title: 'Comprehensive Fire Safety Report 2024',
            description: 'Detailed analysis of fire incidents and prevention measures',
            period: '2024-H1',
            isPublic: false
        };

        const result = await uploadDataset(
            testData.title,
            testFile,
            testUserId,
            testData.period,
            testData.description,
            testData.isPublic
        );

        // Verify database storage
        const storedDatasets = await db.select()
            .from(datasetsTable)
            .where(eq(datasetsTable.id, result.id))
            .execute();

        const storedDataset = storedDatasets[0];
        expect(storedDataset.title).toEqual(testData.title);
        expect(storedDataset.description).toEqual(testData.description);
        expect(storedDataset.period).toEqual(testData.period);
        expect(storedDataset.is_public).toEqual(testData.isPublic);
        expect(storedDataset.uploaded_by).toEqual(testUserId);
        expect(storedDataset.file_type).toEqual('CSV');
        expect(storedDataset.created_at).toBeInstanceOf(Date);
    });
});