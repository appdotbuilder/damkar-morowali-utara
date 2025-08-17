import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { usersTable, mediaTable, galleryTable, categoriesTable } from '../db/schema';
import {
    uploadMedia,
    getMediaById,
    getMediaList,
    updateMediaMetadata,
    deleteMedia,
    createGalleryItem,
    getGalleryItems,
    updateGalleryItem,
    deleteGalleryItem
} from '../handlers/media';
import { eq } from 'drizzle-orm';

describe('Media Handlers', () => {
    beforeEach(createDB);
    afterEach(resetDB);

    // Test data setup
    const createTestUser = async () => {
        const result = await db.insert(usersTable)
            .values({
                username: 'testuser',
                email: 'test@example.com',
                password_hash: 'hashedpassword',
                full_name: 'Test User',
                role: 'editor'
            })
            .returning()
            .execute();
        return result[0];
    };

    const createTestCategory = async () => {
        const result = await db.insert(categoriesTable)
            .values({
                name: 'Test Category',
                slug: 'test-category'
            })
            .returning()
            .execute();
        return result[0];
    };

    const testFile = {
        filename: 'test-image.jpg',
        originalName: 'Test Image.jpg',
        buffer: Buffer.from('fake image data'),
        mimeType: 'image/jpeg'
    };

    describe('uploadMedia', () => {
        it('should upload media successfully', async () => {
            const user = await createTestUser();
            
            const result = await uploadMedia(
                testFile,
                user.id,
                'Test alt text',
                'Test caption'
            );

            expect(result.id).toBeDefined();
            expect(result.filename).toEqual('test-image.jpg');
            expect(result.original_name).toEqual('Test Image.jpg');
            expect(result.file_path).toEqual('/uploads/test-image.jpg');
            expect(result.file_size).toEqual(testFile.buffer.length);
            expect(result.mime_type).toEqual('image/jpeg');
            expect(result.type).toEqual('image');
            expect(result.alt_text).toEqual('Test alt text');
            expect(result.caption).toEqual('Test caption');
            expect(result.uploaded_by).toEqual(user.id);
            expect(result.created_at).toBeInstanceOf(Date);
        });

        it('should upload media without alt text and caption', async () => {
            const user = await createTestUser();
            
            const result = await uploadMedia(testFile, user.id);

            expect(result.alt_text).toBeNull();
            expect(result.caption).toBeNull();
        });

        it('should determine media type correctly', async () => {
            const user = await createTestUser();
            
            // Test video file
            const videoFile = {
                ...testFile,
                filename: 'test-video.mp4',
                mimeType: 'video/mp4'
            };

            const videoResult = await uploadMedia(videoFile, user.id);
            expect(videoResult.type).toEqual('video');

            // Test document file
            const docFile = {
                ...testFile,
                filename: 'test-doc.pdf',
                mimeType: 'application/pdf'
            };

            const docResult = await uploadMedia(docFile, user.id);
            expect(docResult.type).toEqual('document');
        });

        it('should throw error for non-existent user', async () => {
            await expect(uploadMedia(testFile, 999)).rejects.toThrow(/user not found/i);
        });

        it('should save media to database', async () => {
            const user = await createTestUser();
            const result = await uploadMedia(testFile, user.id);

            const mediaFromDb = await db.select()
                .from(mediaTable)
                .where(eq(mediaTable.id, result.id))
                .execute();

            expect(mediaFromDb).toHaveLength(1);
            expect(mediaFromDb[0].filename).toEqual('test-image.jpg');
        });
    });

    describe('getMediaById', () => {
        it('should get media by ID', async () => {
            const user = await createTestUser();
            const uploadedMedia = await uploadMedia(testFile, user.id);

            const result = await getMediaById(uploadedMedia.id);

            expect(result).not.toBeNull();
            expect(result!.id).toEqual(uploadedMedia.id);
            expect(result!.filename).toEqual('test-image.jpg');
        });

        it('should return null for non-existent media', async () => {
            const result = await getMediaById(999);
            expect(result).toBeNull();
        });
    });

    describe('getMediaList', () => {
        it('should get all media', async () => {
            const user = await createTestUser();
            await uploadMedia(testFile, user.id);
            await uploadMedia({
                ...testFile,
                filename: 'test-video.mp4',
                mimeType: 'video/mp4'
            }, user.id);

            const result = await getMediaList();

            expect(result).toHaveLength(2);
            expect(result[0].created_at >= result[1].created_at).toBe(true); // Ordered by created_at desc
        });

        it('should filter by media type', async () => {
            const user = await createTestUser();
            await uploadMedia(testFile, user.id);
            await uploadMedia({
                ...testFile,
                filename: 'test-video.mp4',
                mimeType: 'video/mp4'
            }, user.id);

            const imageResults = await getMediaList('image');
            const videoResults = await getMediaList('video');

            expect(imageResults).toHaveLength(1);
            expect(imageResults[0].type).toEqual('image');
            expect(videoResults).toHaveLength(1);
            expect(videoResults[0].type).toEqual('video');
        });

        it('should filter by uploader', async () => {
            const user1 = await createTestUser();
            const user2 = await db.insert(usersTable)
                .values({
                    username: 'testuser2',
                    email: 'test2@example.com',
                    password_hash: 'hashedpassword',
                    full_name: 'Test User 2',
                    role: 'editor'
                })
                .returning()
                .execute();

            await uploadMedia(testFile, user1.id);
            await uploadMedia({
                ...testFile,
                filename: 'test-video.mp4'
            }, user2[0].id);

            const user1Results = await getMediaList(undefined, user1.id);
            const user2Results = await getMediaList(undefined, user2[0].id);

            expect(user1Results).toHaveLength(1);
            expect(user1Results[0].uploaded_by).toEqual(user1.id);
            expect(user2Results).toHaveLength(1);
            expect(user2Results[0].uploaded_by).toEqual(user2[0].id);
        });

        it('should respect limit parameter', async () => {
            const user = await createTestUser();
            
            for (let i = 0; i < 3; i++) {
                await uploadMedia({
                    ...testFile,
                    filename: `test-image-${i}.jpg`
                }, user.id);
            }

            const result = await getMediaList(undefined, undefined, 2);
            expect(result).toHaveLength(2);
        });
    });

    describe('updateMediaMetadata', () => {
        it('should update alt text and caption', async () => {
            const user = await createTestUser();
            const uploadedMedia = await uploadMedia(testFile, user.id);

            const result = await updateMediaMetadata(
                uploadedMedia.id,
                'Updated alt text',
                'Updated caption'
            );

            expect(result).not.toBeNull();
            expect(result!.alt_text).toEqual('Updated alt text');
            expect(result!.caption).toEqual('Updated caption');
        });

        it('should update only alt text', async () => {
            const user = await createTestUser();
            const uploadedMedia = await uploadMedia(testFile, user.id, 'Original alt', 'Original caption');

            const result = await updateMediaMetadata(uploadedMedia.id, 'Updated alt text');

            expect(result!.alt_text).toEqual('Updated alt text');
            expect(result!.caption).toEqual('Original caption');
        });

        it('should return null for non-existent media', async () => {
            const result = await updateMediaMetadata(999, 'Alt text');
            expect(result).toBeNull();
        });

        it('should return original media if no updates provided', async () => {
            const user = await createTestUser();
            const uploadedMedia = await uploadMedia(testFile, user.id, 'Original alt');

            const result = await updateMediaMetadata(uploadedMedia.id);

            expect(result!.alt_text).toEqual('Original alt');
        });
    });

    describe('deleteMedia', () => {
        it('should delete existing media', async () => {
            const user = await createTestUser();
            const uploadedMedia = await uploadMedia(testFile, user.id);

            const result = await deleteMedia(uploadedMedia.id);

            expect(result).toBe(true);

            const mediaFromDb = await db.select()
                .from(mediaTable)
                .where(eq(mediaTable.id, uploadedMedia.id))
                .execute();

            expect(mediaFromDb).toHaveLength(0);
        });

        it('should return false for non-existent media', async () => {
            const result = await deleteMedia(999);
            expect(result).toBe(false);
        });
    });

    describe('createGalleryItem', () => {
        it('should create gallery item successfully', async () => {
            const user = await createTestUser();
            const category = await createTestCategory();
            const media = await uploadMedia(testFile, user.id);

            const result = await createGalleryItem(
                'Gallery Item Title',
                media.id,
                'Gallery description',
                category.id,
                true
            );

            expect(result.id).toBeDefined();
            expect(result.title).toEqual('Gallery Item Title');
            expect(result.description).toEqual('Gallery description');
            expect(result.media_id).toEqual(media.id);
            expect(result.category_id).toEqual(category.id);
            expect(result.is_featured).toBe(true);
            expect(result.sort_order).toEqual(1);
            expect(result.created_at).toBeInstanceOf(Date);
        });

        it('should create gallery item without optional fields', async () => {
            const user = await createTestUser();
            const media = await uploadMedia(testFile, user.id);

            const result = await createGalleryItem('Gallery Item', media.id);

            expect(result.description).toBeNull();
            expect(result.category_id).toBeNull();
            expect(result.is_featured).toBe(false);
        });

        it('should set correct sort order for multiple items', async () => {
            const user = await createTestUser();
            const media = await uploadMedia(testFile, user.id);

            const item1 = await createGalleryItem('Item 1', media.id);
            const item2 = await createGalleryItem('Item 2', media.id);

            expect(item1.sort_order).toEqual(1);
            expect(item2.sort_order).toEqual(2);
        });

        it('should throw error for non-existent media', async () => {
            await expect(createGalleryItem('Title', 999)).rejects.toThrow(/media not found/i);
        });
    });

    describe('getGalleryItems', () => {
        it('should get all gallery items', async () => {
            const user = await createTestUser();
            const media = await uploadMedia(testFile, user.id);
            await createGalleryItem('Item 1', media.id);
            await createGalleryItem('Item 2', media.id);

            const result = await getGalleryItems();

            expect(result).toHaveLength(2);
            expect(result[0].sort_order >= result[1].sort_order).toBe(true); // Ordered by sort_order desc
        });

        it('should filter by category', async () => {
            const user = await createTestUser();
            const category = await createTestCategory();
            const media = await uploadMedia(testFile, user.id);

            await createGalleryItem('Item 1', media.id, undefined, category.id);
            await createGalleryItem('Item 2', media.id); // No category

            const categoryResults = await getGalleryItems(category.id);
            const allResults = await getGalleryItems();

            expect(categoryResults).toHaveLength(1);
            expect(categoryResults[0].category_id).toEqual(category.id);
            expect(allResults).toHaveLength(2);
        });

        it('should filter by featured status', async () => {
            const user = await createTestUser();
            const media = await uploadMedia(testFile, user.id);

            await createGalleryItem('Featured Item', media.id, undefined, undefined, true);
            await createGalleryItem('Regular Item', media.id, undefined, undefined, false);

            const featuredResults = await getGalleryItems(undefined, true);
            const nonFeaturedResults = await getGalleryItems(undefined, false);

            expect(featuredResults).toHaveLength(1);
            expect(featuredResults[0].is_featured).toBe(true);
            expect(nonFeaturedResults).toHaveLength(1);
            expect(nonFeaturedResults[0].is_featured).toBe(false);
        });

        it('should respect limit parameter', async () => {
            const user = await createTestUser();
            const media = await uploadMedia(testFile, user.id);

            for (let i = 0; i < 3; i++) {
                await createGalleryItem(`Item ${i}`, media.id);
            }

            const result = await getGalleryItems(undefined, undefined, 2);
            expect(result).toHaveLength(2);
        });
    });

    describe('updateGalleryItem', () => {
        it('should update gallery item successfully', async () => {
            const user = await createTestUser();
            const category = await createTestCategory();
            const media = await uploadMedia(testFile, user.id);
            const galleryItem = await createGalleryItem('Original Title', media.id);

            const result = await updateGalleryItem(galleryItem.id, {
                title: 'Updated Title',
                description: 'Updated description',
                categoryId: category.id,
                isFeatured: true,
                sortOrder: 10
            });

            expect(result).not.toBeNull();
            expect(result!.title).toEqual('Updated Title');
            expect(result!.description).toEqual('Updated description');
            expect(result!.category_id).toEqual(category.id);
            expect(result!.is_featured).toBe(true);
            expect(result!.sort_order).toEqual(10);
        });

        it('should update only specified fields', async () => {
            const user = await createTestUser();
            const media = await uploadMedia(testFile, user.id);
            const galleryItem = await createGalleryItem('Original Title', media.id);

            const result = await updateGalleryItem(galleryItem.id, {
                title: 'Updated Title'
            });

            expect(result!.title).toEqual('Updated Title');
            expect(result!.description).toBeNull(); // Should remain unchanged
        });

        it('should return null for non-existent gallery item', async () => {
            const result = await updateGalleryItem(999, { title: 'New Title' });
            expect(result).toBeNull();
        });

        it('should return original item if no updates provided', async () => {
            const user = await createTestUser();
            const media = await uploadMedia(testFile, user.id);
            const galleryItem = await createGalleryItem('Original Title', media.id);

            const result = await updateGalleryItem(galleryItem.id, {});

            expect(result!.title).toEqual('Original Title');
        });
    });

    describe('deleteGalleryItem', () => {
        it('should delete existing gallery item', async () => {
            const user = await createTestUser();
            const media = await uploadMedia(testFile, user.id);
            const galleryItem = await createGalleryItem('Test Item', media.id);

            const result = await deleteGalleryItem(galleryItem.id);

            expect(result).toBe(true);

            const galleryFromDb = await db.select()
                .from(galleryTable)
                .where(eq(galleryTable.id, galleryItem.id))
                .execute();

            expect(galleryFromDb).toHaveLength(0);
        });

        it('should return false for non-existent gallery item', async () => {
            const result = await deleteGalleryItem(999);
            expect(result).toBe(false);
        });
    });
});