import { db } from '../db';
import { mediaTable, galleryTable, usersTable } from '../db/schema';
import { type Media, type Gallery, type MediaType } from '../schema';
import { eq, and, desc, SQL } from 'drizzle-orm';

export async function uploadMedia(
    file: {
        filename: string;
        originalName: string;
        buffer: Buffer;
        mimeType: string;
    },
    uploadedBy: number,
    altText?: string,
    caption?: string
): Promise<Media> {
    try {
        // Verify user exists
        const user = await db.select()
            .from(usersTable)
            .where(eq(usersTable.id, uploadedBy))
            .execute();
        
        if (user.length === 0) {
            throw new Error('User not found');
        }

        // Insert media record
        const result = await db.insert(mediaTable)
            .values({
                filename: file.filename,
                original_name: file.originalName,
                file_path: `/uploads/${file.filename}`,
                file_size: file.buffer.length,
                mime_type: file.mimeType,
                type: determineMediaType(file.mimeType),
                alt_text: altText || null,
                caption: caption || null,
                uploaded_by: uploadedBy
            })
            .returning()
            .execute();

        return result[0];
    } catch (error) {
        console.error('Media upload failed:', error);
        throw error;
    }
}

export async function getMediaById(id: number): Promise<Media | null> {
    try {
        const result = await db.select()
            .from(mediaTable)
            .where(eq(mediaTable.id, id))
            .execute();

        return result.length > 0 ? result[0] : null;
    } catch (error) {
        console.error('Failed to get media by ID:', error);
        throw error;
    }
}

export async function getMediaList(
    type?: MediaType,
    uploadedBy?: number,
    limit: number = 50
): Promise<Media[]> {
    try {
        const conditions: SQL<unknown>[] = [];

        if (type) {
            conditions.push(eq(mediaTable.type, type));
        }

        if (uploadedBy) {
            conditions.push(eq(mediaTable.uploaded_by, uploadedBy));
        }

        const baseQuery = db.select().from(mediaTable);

        const results = conditions.length > 0
            ? await baseQuery
                .where(conditions.length === 1 ? conditions[0] : and(...conditions))
                .orderBy(desc(mediaTable.created_at))
                .limit(limit)
                .execute()
            : await baseQuery
                .orderBy(desc(mediaTable.created_at))
                .limit(limit)
                .execute();

        return results;
    } catch (error) {
        console.error('Failed to get media list:', error);
        throw error;
    }
}

export async function updateMediaMetadata(
    id: number,
    altText?: string,
    caption?: string
): Promise<Media | null> {
    try {
        // Check if media exists
        const existing = await db.select()
            .from(mediaTable)
            .where(eq(mediaTable.id, id))
            .execute();

        if (existing.length === 0) {
            return null;
        }

        // Build update values
        const updateValues: { alt_text?: string | null; caption?: string | null } = {};
        if (altText !== undefined) {
            updateValues.alt_text = altText;
        }
        if (caption !== undefined) {
            updateValues.caption = caption;
        }

        if (Object.keys(updateValues).length === 0) {
            return existing[0];
        }

        const result = await db.update(mediaTable)
            .set(updateValues)
            .where(eq(mediaTable.id, id))
            .returning()
            .execute();

        return result[0];
    } catch (error) {
        console.error('Failed to update media metadata:', error);
        throw error;
    }
}

export async function deleteMedia(id: number): Promise<boolean> {
    try {
        // Check if media exists
        const existing = await db.select()
            .from(mediaTable)
            .where(eq(mediaTable.id, id))
            .execute();

        if (existing.length === 0) {
            return false;
        }

        // Delete media record
        await db.delete(mediaTable)
            .where(eq(mediaTable.id, id))
            .execute();

        return true;
    } catch (error) {
        console.error('Failed to delete media:', error);
        throw error;
    }
}

export async function createGalleryItem(
    title: string,
    mediaId: number,
    description?: string,
    categoryId?: number,
    isFeatured: boolean = false
): Promise<Gallery> {
    try {
        // Verify media exists
        const media = await db.select()
            .from(mediaTable)
            .where(eq(mediaTable.id, mediaId))
            .execute();
        
        if (media.length === 0) {
            throw new Error('Media not found');
        }

        // Get next sort order
        const maxSort = await db.select()
            .from(galleryTable)
            .orderBy(desc(galleryTable.sort_order))
            .limit(1)
            .execute();
        
        const nextSortOrder = maxSort.length > 0 ? maxSort[0].sort_order + 1 : 1;

        // Insert gallery item
        const result = await db.insert(galleryTable)
            .values({
                title: title,
                description: description || null,
                media_id: mediaId,
                category_id: categoryId || null,
                is_featured: isFeatured,
                sort_order: nextSortOrder
            })
            .returning()
            .execute();

        return result[0];
    } catch (error) {
        console.error('Gallery item creation failed:', error);
        throw error;
    }
}

export async function getGalleryItems(
    categoryId?: number,
    isFeatured?: boolean,
    limit: number = 20
): Promise<Gallery[]> {
    try {
        const conditions: SQL<unknown>[] = [];

        if (categoryId) {
            conditions.push(eq(galleryTable.category_id, categoryId));
        }

        if (isFeatured !== undefined) {
            conditions.push(eq(galleryTable.is_featured, isFeatured));
        }

        const baseQuery = db.select().from(galleryTable);

        const results = conditions.length > 0
            ? await baseQuery
                .where(conditions.length === 1 ? conditions[0] : and(...conditions))
                .orderBy(desc(galleryTable.sort_order))
                .limit(limit)
                .execute()
            : await baseQuery
                .orderBy(desc(galleryTable.sort_order))
                .limit(limit)
                .execute();

        return results;
    } catch (error) {
        console.error('Failed to get gallery items:', error);
        throw error;
    }
}

export async function updateGalleryItem(
    id: number,
    updates: {
        title?: string;
        description?: string;
        categoryId?: number;
        isFeatured?: boolean;
        sortOrder?: number;
    }
): Promise<Gallery | null> {
    try {
        // Check if gallery item exists
        const existing = await db.select()
            .from(galleryTable)
            .where(eq(galleryTable.id, id))
            .execute();

        if (existing.length === 0) {
            return null;
        }

        // Build update values
        const updateValues: {
            title?: string;
            description?: string | null;
            category_id?: number | null;
            is_featured?: boolean;
            sort_order?: number;
        } = {};

        if (updates.title !== undefined) {
            updateValues.title = updates.title;
        }
        if (updates.description !== undefined) {
            updateValues.description = updates.description;
        }
        if (updates.categoryId !== undefined) {
            updateValues.category_id = updates.categoryId;
        }
        if (updates.isFeatured !== undefined) {
            updateValues.is_featured = updates.isFeatured;
        }
        if (updates.sortOrder !== undefined) {
            updateValues.sort_order = updates.sortOrder;
        }

        if (Object.keys(updateValues).length === 0) {
            return existing[0];
        }

        const result = await db.update(galleryTable)
            .set(updateValues)
            .where(eq(galleryTable.id, id))
            .returning()
            .execute();

        return result[0];
    } catch (error) {
        console.error('Failed to update gallery item:', error);
        throw error;
    }
}

export async function deleteGalleryItem(id: number): Promise<boolean> {
    try {
        // Check if gallery item exists
        const existing = await db.select()
            .from(galleryTable)
            .where(eq(galleryTable.id, id))
            .execute();

        if (existing.length === 0) {
            return false;
        }

        // Delete gallery item
        await db.delete(galleryTable)
            .where(eq(galleryTable.id, id))
            .execute();

        return true;
    } catch (error) {
        console.error('Failed to delete gallery item:', error);
        throw error;
    }
}

function determineMediaType(mimeType: string): MediaType {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    return 'document';
}