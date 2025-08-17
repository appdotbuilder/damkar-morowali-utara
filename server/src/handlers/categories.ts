import { db } from '../db';
import { categoriesTable, contentCategoriesTable } from '../db/schema';
import { type Category } from '../schema';
import { eq, isNull, count, and, or } from 'drizzle-orm';
import type { SQL } from 'drizzle-orm';

// Helper function to generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')     // Replace spaces with hyphens
    .replace(/-+/g, '-')      // Replace multiple hyphens with single
    .replace(/^-|-$/g, '');   // Remove leading/trailing hyphens
}

export async function createCategory(
    name: string,
    description?: string,
    parentId?: number
): Promise<Category> {
    try {
        const slug = generateSlug(name);

        // Validate parent exists if provided
        if (parentId) {
            const parent = await db.select()
                .from(categoriesTable)
                .where(eq(categoriesTable.id, parentId))
                .execute();

            if (parent.length === 0) {
                throw new Error(`Parent category with ID ${parentId} not found`);
            }
        }

        const result = await db.insert(categoriesTable)
            .values({
                name,
                slug,
                description: description || null,
                parent_id: parentId || null
            })
            .returning()
            .execute();

        return result[0];
    } catch (error) {
        console.error('Category creation failed:', error);
        throw error;
    }
}

export async function getCategoryById(id: number): Promise<Category | null> {
    try {
        const categories = await db.select()
            .from(categoriesTable)
            .where(eq(categoriesTable.id, id))
            .execute();

        return categories.length > 0 ? categories[0] : null;
    } catch (error) {
        console.error('Get category by ID failed:', error);
        throw error;
    }
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
    try {
        const categories = await db.select()
            .from(categoriesTable)
            .where(eq(categoriesTable.slug, slug))
            .execute();

        return categories.length > 0 ? categories[0] : null;
    } catch (error) {
        console.error('Get category by slug failed:', error);
        throw error;
    }
}

export async function getCategories(parentId?: number | null): Promise<Category[]> {
    try {
        if (parentId === null) {
            // Get root categories (parent_id IS NULL)
            const results = await db.select()
                .from(categoriesTable)
                .where(isNull(categoriesTable.parent_id))
                .execute();
            return results;
        } else if (parentId !== undefined) {
            // Get categories with specific parent
            const results = await db.select()
                .from(categoriesTable)
                .where(eq(categoriesTable.parent_id, parentId))
                .execute();
            return results;
        } else {
            // Get all categories
            const results = await db.select()
                .from(categoriesTable)
                .execute();
            return results;
        }
    } catch (error) {
        console.error('Get categories failed:', error);
        throw error;
    }
}

export async function getCategoryTree(): Promise<Category[]> {
    try {
        // Get all categories
        const allCategories = await db.select()
            .from(categoriesTable)
            .execute();

        // For this implementation, we'll return them flat
        // In a more complex implementation, you could build a nested tree structure
        return allCategories;
    } catch (error) {
        console.error('Get category tree failed:', error);
        throw error;
    }
}

export async function updateCategory(
    id: number,
    updates: {
        name?: string;
        description?: string;
        parentId?: number;
    }
): Promise<Category | null> {
    try {
        // Check if category exists
        const existing = await getCategoryById(id);
        if (!existing) {
            return null;
        }

        // Validate parent if provided
        if (updates.parentId !== undefined && updates.parentId !== null) {
            // Prevent self-reference
            if (updates.parentId === id) {
                throw new Error('Category cannot be its own parent');
            }

            const parent = await getCategoryById(updates.parentId);
            if (!parent) {
                throw new Error(`Parent category with ID ${updates.parentId} not found`);
            }
        }

        const updateData: any = {};

        if (updates.name !== undefined) {
            updateData.name = updates.name;
            updateData.slug = generateSlug(updates.name);
        }

        if (updates.description !== undefined) {
            updateData.description = updates.description;
        }

        if (updates.parentId !== undefined) {
            updateData.parent_id = updates.parentId;
        }

        const results = await db.update(categoriesTable)
            .set(updateData)
            .where(eq(categoriesTable.id, id))
            .returning()
            .execute();

        return results.length > 0 ? results[0] : null;
    } catch (error) {
        console.error('Update category failed:', error);
        throw error;
    }
}

export async function deleteCategory(id: number, reassignToId?: number): Promise<boolean> {
    try {
        // Check if category exists
        const category = await getCategoryById(id);
        if (!category) {
            return false;
        }

        // Validate reassign target if provided
        if (reassignToId !== undefined) {
            const reassignTarget = await getCategoryById(reassignToId);
            if (!reassignTarget) {
                throw new Error(`Reassign target category with ID ${reassignToId} not found`);
            }
        }

        // Handle child categories
        const childCategories = await db.select()
            .from(categoriesTable)
            .where(eq(categoriesTable.parent_id, id))
            .execute();

        if (childCategories.length > 0) {
            if (reassignToId !== undefined) {
                // Reassign child categories to new parent
                await db.update(categoriesTable)
                    .set({ parent_id: reassignToId })
                    .where(eq(categoriesTable.parent_id, id))
                    .execute();
            } else {
                // Set child categories to root level (parent_id = null)
                await db.update(categoriesTable)
                    .set({ parent_id: null })
                    .where(eq(categoriesTable.parent_id, id))
                    .execute();
            }
        }

        // Handle content associations
        if (reassignToId !== undefined) {
            // Reassign content to new category
            await db.update(contentCategoriesTable)
                .set({ category_id: reassignToId })
                .where(eq(contentCategoriesTable.category_id, id))
                .execute();
        } else {
            // Remove content associations
            await db.delete(contentCategoriesTable)
                .where(eq(contentCategoriesTable.category_id, id))
                .execute();
        }

        // Delete the category
        const result = await db.delete(categoriesTable)
            .where(eq(categoriesTable.id, id))
            .execute();

        return (result.rowCount ?? 0) > 0;
    } catch (error) {
        console.error('Delete category failed:', error);
        throw error;
    }
}

export async function getCategoryWithContent(
    categoryId: number,
    limit: number = 10
): Promise<{ category: Category; contentCount: number } | null> {
    try {
        // Get the category
        const category = await getCategoryById(categoryId);
        if (!category) {
            return null;
        }

        // Count associated content
        const contentCountResult = await db.select({ count: count() })
            .from(contentCategoriesTable)
            .where(eq(contentCategoriesTable.category_id, categoryId))
            .execute();

        const contentCount = contentCountResult[0]?.count || 0;

        return {
            category,
            contentCount
        };
    } catch (error) {
        console.error('Get category with content failed:', error);
        throw error;
    }
}