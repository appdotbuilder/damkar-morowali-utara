import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { usersTable, categoriesTable, tagsTable, contentTable, contentCategoriesTable, contentTagsTable } from '../db/schema';
import { type CreateContentInput } from '../schema';
import { 
  createContent, 
  getContentById, 
  getContentList, 
  updateContent, 
  deleteContent,
  getPublishedContent 
} from '../handlers/content';
import { eq, and } from 'drizzle-orm';

// Test data
const testUser = {
  username: 'testauthor',
  email: 'author@test.com',
  password_hash: 'hashed_password',
  full_name: 'Test Author',
  role: 'editor' as const
};

const testCategory = {
  name: 'Fire Safety',
  slug: 'fire-safety',
  description: 'Fire safety related content'
};

const testTag = {
  name: 'Emergency',
  slug: 'emergency'
};

const testContentInput: CreateContentInput = {
  title: 'Fire Safety Guidelines',
  content: 'Complete guide to fire safety procedures and protocols.',
  excerpt: 'Essential fire safety information for everyone.',
  type: 'educational_material',
  status: 'draft',
  featured_image: '/images/fire-safety.jpg',
  meta_title: 'Fire Safety Guidelines - Fire Department',
  meta_description: 'Learn essential fire safety procedures and protocols.'
};

describe('Content Handlers', () => {
  let userId: number;
  let categoryId: number;
  let tagId: number;

  beforeEach(async () => {
    await createDB();
    
    // Create test user
    const userResult = await db.insert(usersTable)
      .values(testUser)
      .returning()
      .execute();
    userId = userResult[0].id;

    // Create test category
    const categoryResult = await db.insert(categoriesTable)
      .values(testCategory)
      .returning()
      .execute();
    categoryId = categoryResult[0].id;

    // Create test tag
    const tagResult = await db.insert(tagsTable)
      .values(testTag)
      .returning()
      .execute();
    tagId = tagResult[0].id;
  });

  afterEach(resetDB);

  describe('createContent', () => {
    it('should create content successfully', async () => {
      const result = await createContent(testContentInput, userId);

      expect(result.title).toEqual('Fire Safety Guidelines');
      expect(result.content).toEqual(testContentInput.content);
      expect(result.excerpt).toEqual('Essential fire safety information for everyone.');
      expect(result.type).toEqual('educational_material');
      expect(result.status).toEqual('draft');
      expect(result.featured_image).toEqual('/images/fire-safety.jpg');
      expect(result.meta_title).toEqual('Fire Safety Guidelines - Fire Department');
      expect(result.meta_description).toEqual('Learn essential fire safety procedures and protocols.');
      expect(result.author_id).toEqual(userId);
      expect(result.published_at).toBeNull();
      expect(result.id).toBeDefined();
      expect(result.created_at).toBeInstanceOf(Date);
      expect(result.updated_at).toBeInstanceOf(Date);
      expect(result.slug).toContain('fire-safety-guidelines');
    });

    it('should create content with published status and set published_at', async () => {
      const publishedInput: CreateContentInput = {
        ...testContentInput,
        status: 'published'
      };

      const result = await createContent(publishedInput, userId);

      expect(result.status).toEqual('published');
      expect(result.published_at).toBeInstanceOf(Date);
    });

    it('should create content with category associations', async () => {
      const inputWithCategory: CreateContentInput = {
        title: 'Fire Safety Guidelines',
        content: 'Complete guide to fire safety procedures and protocols.',
        type: 'educational_material',
        category_ids: [categoryId]
      };

      const result = await createContent(inputWithCategory, userId);

      // Verify category association exists
      const associations = await db.select()
        .from(contentCategoriesTable)
        .where(eq(contentCategoriesTable.content_id, result.id))
        .execute();

      expect(associations).toHaveLength(1);
      expect(associations[0].category_id).toEqual(categoryId);
    });

    it('should create content with tag associations', async () => {
      const inputWithTag: CreateContentInput = {
        title: 'Fire Safety Guidelines',
        content: 'Complete guide to fire safety procedures and protocols.',
        type: 'educational_material',
        tag_ids: [tagId]
      };

      const result = await createContent(inputWithTag, userId);

      // Verify tag association exists
      const associations = await db.select()
        .from(contentTagsTable)
        .where(eq(contentTagsTable.content_id, result.id))
        .execute();

      expect(associations).toHaveLength(1);
      expect(associations[0].tag_id).toEqual(tagId);
    });

    it('should handle default status when not provided', async () => {
      const inputWithoutStatus: CreateContentInput = {
        title: 'Test Content',
        content: 'Test content body',
        type: 'news'
      };

      const result = await createContent(inputWithoutStatus, userId);

      expect(result.status).toEqual('draft');
      expect(result.published_at).toBeNull();
    });

    it('should generate unique slug with ID', async () => {
      const result = await createContent(testContentInput, userId);

      expect(result.slug).toMatch(/fire-safety-guidelines-\d+/);
    });

    it('should throw error for non-existent author', async () => {
      const nonExistentUserId = 99999;

      await expect(createContent(testContentInput, nonExistentUserId))
        .rejects.toThrow(/author not found/i);
    });
  });

  describe('getContentById', () => {
    it('should retrieve content by ID', async () => {
      const created = await createContent(testContentInput, userId);
      const result = await getContentById(created.id);

      expect(result).not.toBeNull();
      expect(result!.id).toEqual(created.id);
      expect(result!.title).toEqual('Fire Safety Guidelines');
      expect(result!.author_id).toEqual(userId);
    });

    it('should return null for non-existent content', async () => {
      const result = await getContentById(99999);

      expect(result).toBeNull();
    });
  });

  describe('getContentList', () => {
    beforeEach(async () => {
      // Create sample content for filtering tests
      await createContent({
        title: 'News Article 1',
        content: 'News content 1',
        type: 'news',
        status: 'published'
      }, userId);

      await createContent({
        title: 'News Article 2',
        content: 'News content 2',
        type: 'news',
        status: 'draft'
      }, userId);

      await createContent({
        title: 'Educational Material',
        content: 'Educational content',
        type: 'educational_material',
        status: 'published'
      }, userId);
    });

    it('should return all content without filters', async () => {
      const result = await getContentList();

      expect(result.length).toBeGreaterThanOrEqual(3);
    });

    it('should filter by content type', async () => {
      const result = await getContentList({ type: 'news' });

      expect(result).toHaveLength(2);
      result.forEach(content => {
        expect(content.type).toEqual('news');
      });
    });

    it('should filter by status', async () => {
      const result = await getContentList({ status: 'published' });

      expect(result).toHaveLength(2);
      result.forEach(content => {
        expect(content.status).toEqual('published');
      });
    });

    it('should filter by author', async () => {
      const result = await getContentList({ author_id: userId });

      expect(result.length).toBeGreaterThanOrEqual(3);
      result.forEach(content => {
        expect(content.author_id).toEqual(userId);
      });
    });

    it('should apply pagination', async () => {
      const result = await getContentList({ limit: 2, offset: 1 });

      expect(result).toHaveLength(2);
    });

    it('should sort by specified field', async () => {
      const result = await getContentList({ 
        sort_by: 'title', 
        sort_order: 'asc' 
      });

      expect(result.length).toBeGreaterThan(0);
      // Verify ascending order
      for (let i = 1; i < result.length; i++) {
        expect(result[i].title >= result[i-1].title).toBe(true);
      }
    });

    it('should filter by category', async () => {
      // Create content with category
      const contentWithCategory = await createContent({
        title: 'Categorized Content',
        content: 'Content with category',
        type: 'news',
        category_ids: [categoryId]
      }, userId);

      const result = await getContentList({ category_id: categoryId });

      expect(result.length).toBeGreaterThan(0);
      // Verify content exists in results (structure may vary due to join)
      const contentIds = result.map(c => c.id || (c as any).content?.id).filter(Boolean);
      expect(contentIds).toContain(contentWithCategory.id);
    });
  });

  describe('updateContent', () => {
    let contentId: number;

    beforeEach(async () => {
      const created = await createContent(testContentInput, userId);
      contentId = created.id;
    });

    it('should update content fields', async () => {
      const updateData = {
        title: 'Updated Fire Safety Guidelines',
        content: 'Updated content body',
        status: 'published' as const
      };

      const result = await updateContent(contentId, updateData);

      expect(result).not.toBeNull();
      expect(result!.title).toEqual('Updated Fire Safety Guidelines');
      expect(result!.content).toEqual('Updated content body');
      expect(result!.status).toEqual('published');
      expect(result!.published_at).toBeInstanceOf(Date);
      expect(result!.updated_at).toBeInstanceOf(Date);
    });

    it('should set published_at when changing status to published', async () => {
      const result = await updateContent(contentId, { status: 'published' });

      expect(result!.status).toEqual('published');
      expect(result!.published_at).toBeInstanceOf(Date);
    });

    it('should clear published_at when changing status from published to draft', async () => {
      // First publish
      await updateContent(contentId, { status: 'published' });
      
      // Then change to draft
      const result = await updateContent(contentId, { status: 'draft' });

      expect(result!.status).toEqual('draft');
      expect(result!.published_at).toBeNull();
    });

    it('should update slug when title changes', async () => {
      const result = await updateContent(contentId, { title: 'New Title' });

      expect(result!.title).toEqual('New Title');
      expect(result!.slug).toMatch(/new-title-\d+/);
    });

    it('should update category associations', async () => {
      await updateContent(contentId, { category_ids: [categoryId] });

      const associations = await db.select()
        .from(contentCategoriesTable)
        .where(eq(contentCategoriesTable.content_id, contentId))
        .execute();

      expect(associations).toHaveLength(1);
      expect(associations[0].category_id).toEqual(categoryId);
    });

    it('should update tag associations', async () => {
      await updateContent(contentId, { tag_ids: [tagId] });

      const associations = await db.select()
        .from(contentTagsTable)
        .where(eq(contentTagsTable.content_id, contentId))
        .execute();

      expect(associations).toHaveLength(1);
      expect(associations[0].tag_id).toEqual(tagId);
    });

    it('should return null for non-existent content', async () => {
      const result = await updateContent(99999, { title: 'New Title' });

      expect(result).toBeNull();
    });
  });

  describe('deleteContent', () => {
    let contentId: number;

    beforeEach(async () => {
      const created = await createContent({
        title: 'Fire Safety Guidelines',
        content: 'Complete guide to fire safety procedures and protocols.',
        type: 'educational_material',
        category_ids: [categoryId],
        tag_ids: [tagId]
      }, userId);
      contentId = created.id;
    });

    it('should delete content and associations', async () => {
      const result = await deleteContent(contentId);

      expect(result).toBe(true);

      // Verify content is deleted
      const content = await getContentById(contentId);
      expect(content).toBeNull();

      // Verify category associations are deleted
      const categoryAssociations = await db.select()
        .from(contentCategoriesTable)
        .where(eq(contentCategoriesTable.content_id, contentId))
        .execute();
      expect(categoryAssociations).toHaveLength(0);

      // Verify tag associations are deleted
      const tagAssociations = await db.select()
        .from(contentTagsTable)
        .where(eq(contentTagsTable.content_id, contentId))
        .execute();
      expect(tagAssociations).toHaveLength(0);
    });

    it('should return false for non-existent content', async () => {
      const result = await deleteContent(99999);

      expect(result).toBe(false);
    });
  });

  describe('getPublishedContent', () => {
    beforeEach(async () => {
      // Create published content of different types
      await createContent({
        title: 'Published News 1',
        content: 'News content 1',
        type: 'news',
        status: 'published'
      }, userId);

      await createContent({
        title: 'Published News 2',
        content: 'News content 2',
        type: 'news',
        status: 'published'
      }, userId);

      await createContent({
        title: 'Published Educational',
        content: 'Educational content',
        type: 'educational_material',
        status: 'published'
      }, userId);

      await createContent({
        title: 'Draft News',
        content: 'Draft news content',
        type: 'news',
        status: 'draft'
      }, userId);
    });

    it('should return all published content', async () => {
      const result = await getPublishedContent();

      expect(result.length).toBeGreaterThanOrEqual(3);
      result.forEach(content => {
        expect(content.status).toEqual('published');
      });
    });

    it('should filter published content by type', async () => {
      const result = await getPublishedContent('news');

      expect(result).toHaveLength(2);
      result.forEach(content => {
        expect(content.type).toEqual('news');
        expect(content.status).toEqual('published');
      });
    });

    it('should respect limit parameter', async () => {
      const result = await getPublishedContent(undefined, 2);

      expect(result).toHaveLength(2);
      result.forEach(content => {
        expect(content.status).toEqual('published');
      });
    });

    it('should order by published_at descending', async () => {
      const result = await getPublishedContent();

      expect(result.length).toBeGreaterThan(1);
      // Verify descending order by published_at
      for (let i = 1; i < result.length; i++) {
        const prevDate = result[i-1].published_at;
        const currDate = result[i].published_at;
        if (prevDate && currDate) {
          expect(prevDate >= currDate).toBe(true);
        }
      }
    });
  });
});