import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { categoriesTable, contentCategoriesTable } from '../db/schema';
import { eq, count } from 'drizzle-orm';
import {
    createCategory,
    getCategoryById,
    getCategoryBySlug,
    getCategories,
    getCategoryTree,
    updateCategory,
    deleteCategory,
    getCategoryWithContent
} from '../handlers/categories';

describe('Categories Handler', () => {
    beforeEach(createDB);
    afterEach(resetDB);

    describe('createCategory', () => {
        it('should create a category without parent', async () => {
            const result = await createCategory('Technology', 'Tech-related content');

            expect(result.name).toEqual('Technology');
            expect(result.slug).toEqual('technology');
            expect(result.description).toEqual('Tech-related content');
            expect(result.parent_id).toBeNull();
            expect(result.id).toBeDefined();
            expect(result.created_at).toBeInstanceOf(Date);
        });

        it('should create a category with parent', async () => {
            // Create parent category first
            const parent = await createCategory('News', 'News content');

            // Create child category
            const result = await createCategory('Local News', 'Local news stories', parent.id);

            expect(result.name).toEqual('Local News');
            expect(result.slug).toEqual('local-news');
            expect(result.parent_id).toEqual(parent.id);
            expect(result.id).toBeDefined();
        });

        it('should generate proper slug from name', async () => {
            const result = await createCategory('Fire Safety & Prevention!', 'Safety content');

            expect(result.slug).toEqual('fire-safety-prevention');
        });

        it('should save category to database', async () => {
            const result = await createCategory('Education', 'Educational materials');

            const categories = await db.select()
                .from(categoriesTable)
                .where(eq(categoriesTable.id, result.id))
                .execute();

            expect(categories).toHaveLength(1);
            expect(categories[0].name).toEqual('Education');
            expect(categories[0].slug).toEqual('education');
        });

        it('should reject invalid parent ID', async () => {
            expect(createCategory('Child', 'Description', 999)).rejects.toThrow(/Parent category with ID 999 not found/i);
        });
    });

    describe('getCategoryById', () => {
        it('should return category by ID', async () => {
            const created = await createCategory('Sports', 'Sports content');
            const result = await getCategoryById(created.id);

            expect(result).not.toBeNull();
            expect(result!.id).toEqual(created.id);
            expect(result!.name).toEqual('Sports');
            expect(result!.slug).toEqual('sports');
        });

        it('should return null for non-existent ID', async () => {
            const result = await getCategoryById(999);
            expect(result).toBeNull();
        });
    });

    describe('getCategoryBySlug', () => {
        it('should return category by slug', async () => {
            const created = await createCategory('Health & Safety', 'Health content');
            const result = await getCategoryBySlug('health-safety');

            expect(result).not.toBeNull();
            expect(result!.id).toEqual(created.id);
            expect(result!.name).toEqual('Health & Safety');
            expect(result!.slug).toEqual('health-safety');
        });

        it('should return null for non-existent slug', async () => {
            const result = await getCategoryBySlug('non-existent');
            expect(result).toBeNull();
        });
    });

    describe('getCategories', () => {
        it('should return all categories when no parent specified', async () => {
            await createCategory('Cat 1');
            await createCategory('Cat 2');
            const parent = await createCategory('Parent');
            await createCategory('Child', 'Description', parent.id);

            const result = await getCategories();

            expect(result).toHaveLength(4);
            expect(result.map(c => c.name)).toContain('Cat 1');
            expect(result.map(c => c.name)).toContain('Child');
        });

        it('should return root categories when parent is null', async () => {
            const parent = await createCategory('Parent');
            await createCategory('Root 1');
            await createCategory('Root 2');
            await createCategory('Child', 'Description', parent.id);

            const result = await getCategories(null);

            expect(result).toHaveLength(3); // Parent, Root 1, Root 2
            expect(result.map(c => c.name)).toContain('Parent');
            expect(result.map(c => c.name)).toContain('Root 1');
            expect(result.map(c => c.name)).not.toContain('Child');
        });

        it('should return child categories for specific parent', async () => {
            const parent = await createCategory('Parent');
            await createCategory('Root');
            await createCategory('Child 1', 'Description', parent.id);
            await createCategory('Child 2', 'Description', parent.id);

            const result = await getCategories(parent.id);

            expect(result).toHaveLength(2);
            expect(result.map(c => c.name)).toContain('Child 1');
            expect(result.map(c => c.name)).toContain('Child 2');
            expect(result.map(c => c.name)).not.toContain('Root');
        });
    });

    describe('getCategoryTree', () => {
        it('should return all categories', async () => {
            const parent = await createCategory('Parent');
            await createCategory('Root');
            await createCategory('Child', 'Description', parent.id);

            const result = await getCategoryTree();

            expect(result).toHaveLength(3);
            expect(result.map(c => c.name)).toContain('Parent');
            expect(result.map(c => c.name)).toContain('Root');
            expect(result.map(c => c.name)).toContain('Child');
        });
    });

    describe('updateCategory', () => {
        it('should update category name and regenerate slug', async () => {
            const created = await createCategory('Old Name');
            const result = await updateCategory(created.id, {
                name: 'New & Improved Name!'
            });

            expect(result).not.toBeNull();
            expect(result!.name).toEqual('New & Improved Name!');
            expect(result!.slug).toEqual('new-improved-name');
        });

        it('should update category description', async () => {
            const created = await createCategory('Test');
            const result = await updateCategory(created.id, {
                description: 'Updated description'
            });

            expect(result).not.toBeNull();
            expect(result!.description).toEqual('Updated description');
            expect(result!.name).toEqual('Test'); // Should not change
        });

        it('should update parent ID', async () => {
            const parent = await createCategory('Parent');
            const created = await createCategory('Child');

            const result = await updateCategory(created.id, {
                parentId: parent.id
            });

            expect(result).not.toBeNull();
            expect(result!.parent_id).toEqual(parent.id);
        });

        it('should return null for non-existent category', async () => {
            const result = await updateCategory(999, { name: 'Test' });
            expect(result).toBeNull();
        });

        it('should reject self-reference as parent', async () => {
            const created = await createCategory('Test');

            expect(updateCategory(created.id, { parentId: created.id }))
                .rejects.toThrow(/Category cannot be its own parent/i);
        });

        it('should reject invalid parent ID', async () => {
            const created = await createCategory('Test');

            expect(updateCategory(created.id, { parentId: 999 }))
                .rejects.toThrow(/Parent category with ID 999 not found/i);
        });
    });

    describe('deleteCategory', () => {
        it('should delete category without children or content', async () => {
            const created = await createCategory('Test');
            const result = await deleteCategory(created.id);

            expect(result).toBe(true);

            // Verify deletion
            const found = await getCategoryById(created.id);
            expect(found).toBeNull();
        });

        it('should return false for non-existent category', async () => {
            const result = await deleteCategory(999);
            expect(result).toBe(false);
        });

        it('should reassign child categories to new parent', async () => {
            const grandparent = await createCategory('Grandparent');
            const parent = await createCategory('Parent');
            const child = await createCategory('Child', 'Description', parent.id);

            const result = await deleteCategory(parent.id, grandparent.id);

            expect(result).toBe(true);

            // Check child was reassigned
            const updatedChild = await getCategoryById(child.id);
            expect(updatedChild!.parent_id).toEqual(grandparent.id);
        });

        it('should move child categories to root level when no reassign target', async () => {
            const parent = await createCategory('Parent');
            const child = await createCategory('Child', 'Description', parent.id);

            const result = await deleteCategory(parent.id);

            expect(result).toBe(true);

            // Check child became root level
            const updatedChild = await getCategoryById(child.id);
            expect(updatedChild!.parent_id).toBeNull();
        });

        it('should handle content associations when deleting', async () => {
            const category = await createCategory('Test Category');

            // Create a content association (simulated)
            await db.insert(contentCategoriesTable).values({
                content_id: 1, // Simulated content ID
                category_id: category.id
            }).execute();

            const result = await deleteCategory(category.id);

            expect(result).toBe(true);

            // Verify content association was removed
            const associations = await db.select()
                .from(contentCategoriesTable)
                .where(eq(contentCategoriesTable.category_id, category.id))
                .execute();

            expect(associations).toHaveLength(0);
        });
    });

    describe('getCategoryWithContent', () => {
        it('should return category with content count', async () => {
            const category = await createCategory('Test Category');

            // Create content associations (simulated)
            await db.insert(contentCategoriesTable).values([
                { content_id: 1, category_id: category.id },
                { content_id: 2, category_id: category.id }
            ]).execute();

            const result = await getCategoryWithContent(category.id);

            expect(result).not.toBeNull();
            expect(result!.category.id).toEqual(category.id);
            expect(result!.category.name).toEqual('Test Category');
            expect(result!.contentCount).toEqual(2);
        });

        it('should return zero content count for category with no content', async () => {
            const category = await createCategory('Empty Category');

            const result = await getCategoryWithContent(category.id);

            expect(result).not.toBeNull();
            expect(result!.category.id).toEqual(category.id);
            expect(result!.contentCount).toEqual(0);
        });

        it('should return null for non-existent category', async () => {
            const result = await getCategoryWithContent(999);
            expect(result).toBeNull();
        });
    });
});