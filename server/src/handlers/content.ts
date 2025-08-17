import { db } from '../db';
import { 
  contentTable, 
  contentCategoriesTable, 
  contentTagsTable, 
  categoriesTable,
  tagsTable,
  usersTable
} from '../db/schema';
import { 
    type CreateContentInput, 
    type Content, 
    type ContentFilterInput,
    type ContentType,
    type ContentStatus 
} from '../schema';
import { eq, and, or, like, desc, asc, isNull, SQL } from 'drizzle-orm';

// Helper function to generate unique slug
function generateSlug(title: string, id?: number): string {
  let slug = title.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim(); // Remove leading/trailing whitespace
  
  if (id) {
    slug += `-${id}`;
  }
  
  return slug;
}

export async function createContent(input: CreateContentInput, authorId: number): Promise<Content> {
  try {
    // Verify author exists
    const author = await db.select()
      .from(usersTable)
      .where(eq(usersTable.id, authorId))
      .limit(1)
      .execute();

    if (!author.length) {
      throw new Error('Author not found');
    }

    // Generate initial slug
    const initialSlug = generateSlug(input.title);
    
    // Set published_at if status is published
    const publishedAt = input.status === 'published' ? new Date() : null;

    // Insert content record
    const result = await db.insert(contentTable)
      .values({
        title: input.title,
        slug: initialSlug, // We'll update this with ID if needed
        content: input.content,
        excerpt: input.excerpt ?? null,
        type: input.type,
        status: input.status || 'draft',
        featured_image: input.featured_image ?? null,
        meta_title: input.meta_title ?? null,
        meta_description: input.meta_description ?? null,
        author_id: authorId,
        published_at: publishedAt
      })
      .returning()
      .execute();

    const createdContent = result[0];

    // Update slug with ID to ensure uniqueness
    const finalSlug = generateSlug(input.title, createdContent.id);
    await db.update(contentTable)
      .set({ slug: finalSlug })
      .where(eq(contentTable.id, createdContent.id))
      .execute();

    // Handle category associations
    if (input.category_ids && input.category_ids.length > 0) {
      // Verify categories exist
      const existingCategories = await db.select({ id: categoriesTable.id })
        .from(categoriesTable)
        .where(eq(categoriesTable.id, input.category_ids[0]))
        .execute();

      if (existingCategories.length > 0) {
        await db.insert(contentCategoriesTable)
          .values(
            input.category_ids.map(categoryId => ({
              content_id: createdContent.id,
              category_id: categoryId
            }))
          )
          .execute();
      }
    }

    // Handle tag associations
    if (input.tag_ids && input.tag_ids.length > 0) {
      // Verify tags exist
      const existingTags = await db.select({ id: tagsTable.id })
        .from(tagsTable)
        .where(eq(tagsTable.id, input.tag_ids[0]))
        .execute();

      if (existingTags.length > 0) {
        await db.insert(contentTagsTable)
          .values(
            input.tag_ids.map(tagId => ({
              content_id: createdContent.id,
              tag_id: tagId
            }))
          )
          .execute();
      }
    }

    return {
      ...createdContent,
      slug: finalSlug
    };
  } catch (error) {
    console.error('Content creation failed:', error);
    throw error;
  }
}

export async function getContentById(id: number): Promise<Content | null> {
  try {
    const result = await db.select()
      .from(contentTable)
      .where(eq(contentTable.id, id))
      .limit(1)
      .execute();

    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error('Get content by ID failed:', error);
    throw error;
  }
}

export async function getContentList(filters: ContentFilterInput = {}): Promise<Content[]> {
  try {
    // Handle queries with joins separately
    if (filters.category_id) {
      return await getContentListWithCategoryFilter(filters);
    }
    
    if (filters.tag_id) {
      return await getContentListWithTagFilter(filters);
    }

    // Build conditions for simple query
    const conditions: SQL<unknown>[] = [];

    if (filters.type) {
      conditions.push(eq(contentTable.type, filters.type));
    }

    if (filters.status) {
      conditions.push(eq(contentTable.status, filters.status));
    }

    if (filters.author_id) {
      conditions.push(eq(contentTable.author_id, filters.author_id));
    }

    // Determine sort order
    let orderBy;
    if (filters.sort_by === 'created_at') {
      orderBy = filters.sort_order === 'desc' ? desc(contentTable.created_at) : asc(contentTable.created_at);
    } else if (filters.sort_by === 'published_at') {
      orderBy = filters.sort_order === 'desc' ? desc(contentTable.published_at) : asc(contentTable.published_at);
    } else if (filters.sort_by === 'title') {
      orderBy = filters.sort_order === 'desc' ? desc(contentTable.title) : asc(contentTable.title);
    } else {
      orderBy = desc(contentTable.created_at);
    }

    // Build complete query at once
    const limit = filters.limit || 10;
    const offset = filters.offset || 0;

    let results;
    if (conditions.length > 0) {
      results = await db.select()
        .from(contentTable)
        .where(conditions.length === 1 ? conditions[0] : and(...conditions))
        .orderBy(orderBy)
        .limit(limit)
        .offset(offset)
        .execute();
    } else {
      results = await db.select()
        .from(contentTable)
        .orderBy(orderBy)
        .limit(limit)
        .offset(offset)
        .execute();
    }

    return results;
  } catch (error) {
    console.error('Get content list failed:', error);
    throw error;
  }
}

// Helper function for category filtering
async function getContentListWithCategoryFilter(filters: ContentFilterInput): Promise<Content[]> {
  const conditions: SQL<unknown>[] = [
    eq(contentCategoriesTable.category_id, filters.category_id!)
  ];

  if (filters.type) {
    conditions.push(eq(contentTable.type, filters.type));
  }

  if (filters.status) {
    conditions.push(eq(contentTable.status, filters.status));
  }

  if (filters.author_id) {
    conditions.push(eq(contentTable.author_id, filters.author_id));
  }

  // Determine sort order
  let orderBy;
  if (filters.sort_by === 'created_at') {
    orderBy = filters.sort_order === 'desc' ? desc(contentTable.created_at) : asc(contentTable.created_at);
  } else if (filters.sort_by === 'published_at') {
    orderBy = filters.sort_order === 'desc' ? desc(contentTable.published_at) : asc(contentTable.published_at);
  } else if (filters.sort_by === 'title') {
    orderBy = filters.sort_order === 'desc' ? desc(contentTable.title) : asc(contentTable.title);
  } else {
    orderBy = desc(contentTable.created_at);
  }

  const limit = filters.limit || 10;
  const offset = filters.offset || 0;

  const results = await db.select()
    .from(contentTable)
    .innerJoin(
      contentCategoriesTable,
      eq(contentTable.id, contentCategoriesTable.content_id)
    )
    .where(and(...conditions))
    .orderBy(orderBy)
    .limit(limit)
    .offset(offset)
    .execute();

  // Extract content data from joined results
  return results.map((result: any) => result.content);
}

// Helper function for tag filtering
async function getContentListWithTagFilter(filters: ContentFilterInput): Promise<Content[]> {
  const conditions: SQL<unknown>[] = [
    eq(contentTagsTable.tag_id, filters.tag_id!)
  ];

  if (filters.type) {
    conditions.push(eq(contentTable.type, filters.type));
  }

  if (filters.status) {
    conditions.push(eq(contentTable.status, filters.status));
  }

  if (filters.author_id) {
    conditions.push(eq(contentTable.author_id, filters.author_id));
  }

  // Determine sort order
  let orderBy;
  if (filters.sort_by === 'created_at') {
    orderBy = filters.sort_order === 'desc' ? desc(contentTable.created_at) : asc(contentTable.created_at);
  } else if (filters.sort_by === 'published_at') {
    orderBy = filters.sort_order === 'desc' ? desc(contentTable.published_at) : asc(contentTable.published_at);
  } else if (filters.sort_by === 'title') {
    orderBy = filters.sort_order === 'desc' ? desc(contentTable.title) : asc(contentTable.title);
  } else {
    orderBy = desc(contentTable.created_at);
  }

  const limit = filters.limit || 10;
  const offset = filters.offset || 0;

  const results = await db.select()
    .from(contentTable)
    .innerJoin(
      contentTagsTable,
      eq(contentTable.id, contentTagsTable.content_id)
    )
    .where(and(...conditions))
    .orderBy(orderBy)
    .limit(limit)
    .offset(offset)
    .execute();

  // Extract content data from joined results
  return results.map((result: any) => result.content);
}

export async function updateContent(id: number, input: Partial<CreateContentInput>): Promise<Content | null> {
  try {
    // Check if content exists
    const existing = await getContentById(id);
    if (!existing) {
      return null;
    }

    const updateData: any = {
      updated_at: new Date()
    };

    // Update fields if provided
    if (input.title) {
      updateData.title = input.title;
      updateData.slug = generateSlug(input.title, id);
    }

    if (input.content !== undefined) updateData.content = input.content;
    if (input.excerpt !== undefined) updateData.excerpt = input.excerpt ?? null;
    if (input.type !== undefined) updateData.type = input.type;
    if (input.featured_image !== undefined) updateData.featured_image = input.featured_image ?? null;
    if (input.meta_title !== undefined) updateData.meta_title = input.meta_title ?? null;
    if (input.meta_description !== undefined) updateData.meta_description = input.meta_description ?? null;

    // Handle status change and published_at
    if (input.status !== undefined) {
      updateData.status = input.status;
      
      // Set published_at when changing to published
      if (input.status === 'published' && existing.status !== 'published') {
        updateData.published_at = new Date();
      }
      // Clear published_at when changing from published to draft
      else if (input.status === 'draft' && existing.status === 'published') {
        updateData.published_at = null;
      }
    }

    // Update content record
    const result = await db.update(contentTable)
      .set(updateData)
      .where(eq(contentTable.id, id))
      .returning()
      .execute();

    // Handle category updates
    if (input.category_ids !== undefined) {
      // Remove existing category associations
      await db.delete(contentCategoriesTable)
        .where(eq(contentCategoriesTable.content_id, id))
        .execute();

      // Add new category associations
      if (input.category_ids.length > 0) {
        await db.insert(contentCategoriesTable)
          .values(
            input.category_ids.map(categoryId => ({
              content_id: id,
              category_id: categoryId
            }))
          )
          .execute();
      }
    }

    // Handle tag updates
    if (input.tag_ids !== undefined) {
      // Remove existing tag associations
      await db.delete(contentTagsTable)
        .where(eq(contentTagsTable.content_id, id))
        .execute();

      // Add new tag associations
      if (input.tag_ids.length > 0) {
        await db.insert(contentTagsTable)
          .values(
            input.tag_ids.map(tagId => ({
              content_id: id,
              tag_id: tagId
            }))
          )
          .execute();
      }
    }

    return result[0];
  } catch (error) {
    console.error('Content update failed:', error);
    throw error;
  }
}

export async function deleteContent(id: number): Promise<boolean> {
  try {
    // Check if content exists
    const existing = await getContentById(id);
    if (!existing) {
      return false;
    }

    // Delete category associations
    await db.delete(contentCategoriesTable)
      .where(eq(contentCategoriesTable.content_id, id))
      .execute();

    // Delete tag associations
    await db.delete(contentTagsTable)
      .where(eq(contentTagsTable.content_id, id))
      .execute();

    // Delete content record
    const result = await db.delete(contentTable)
      .where(eq(contentTable.id, id))
      .returning()
      .execute();

    return result.length > 0;
  } catch (error) {
    console.error('Content deletion failed:', error);
    throw error;
  }
}

export async function getPublishedContent(type?: ContentType, limit: number = 10): Promise<Content[]> {
  try {
    const conditions: SQL<unknown>[] = [eq(contentTable.status, 'published')];

    // Apply type filter if provided
    if (type) {
      conditions.push(eq(contentTable.type, type));
    }

    const query = db.select()
      .from(contentTable)
      .where(and(...conditions))
      .orderBy(desc(contentTable.published_at))
      .limit(limit);

    const results = await query.execute();
    return results as Content[];
  } catch (error) {
    console.error('Get published content failed:', error);
    throw error;
  }
}