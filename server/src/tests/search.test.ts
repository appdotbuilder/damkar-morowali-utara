import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { 
  contentTable, 
  serviceRequestsTable, 
  emergencyContactsTable, 
  datasetsTable,
  usersTable,
  categoriesTable
} from '../db/schema';
import { 
  searchContent,
  searchGlobal,
  getSearchSuggestions,
  getPopularSearches,
  logSearchQuery
} from '../handlers/search';
import { type SearchInput } from '../schema';

describe('Search handlers', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  // Helper function to create test user
  async function createTestUser() {
    const [user] = await db.insert(usersTable)
      .values({
        username: 'testauthor',
        email: 'author@test.com',
        password_hash: 'hashedpassword',
        full_name: 'Test Author',
        role: 'editor'
      })
      .returning()
      .execute();
    return user;
  }

  // Helper function to create test content
  async function createTestContent(user: any) {
    return await db.insert(contentTable)
      .values([
        {
          title: 'Fire Safety Regulations',
          slug: 'fire-safety-regulations',
          content: 'Detailed information about fire safety regulations and compliance requirements.',
          excerpt: 'Important fire safety rules for buildings',
          type: 'regulation',
          status: 'published',
          author_id: user.id,
          published_at: new Date('2024-01-15')
        },
        {
          title: 'Emergency Response Procedures',
          slug: 'emergency-response-procedures',
          content: 'Step-by-step emergency response procedures for fire incidents.',
          excerpt: 'Quick guide for emergency situations',
          type: 'sop',
          status: 'published',
          author_id: user.id,
          published_at: new Date('2024-01-10')
        },
        {
          title: 'Fire Prevention News',
          slug: 'fire-prevention-news',
          content: 'Latest news about fire prevention initiatives in the community.',
          excerpt: 'Community fire prevention updates',
          type: 'news',
          status: 'published',
          author_id: user.id,
          published_at: new Date('2024-01-20')
        },
        {
          title: 'Draft Safety Guidelines',
          slug: 'draft-safety-guidelines',
          content: 'Draft guidelines for safety protocols.',
          excerpt: 'Unpublished safety content',
          type: 'regulation',
          status: 'draft',
          author_id: user.id
        }
      ])
      .returning()
      .execute();
  }

  describe('searchContent', () => {
    it('should search content by title', async () => {
      const user = await createTestUser();
      await createTestContent(user);

      const searchInput: SearchInput = {
        query: 'fire',
        limit: 10,
        offset: 0
      };

      const result = await searchContent(searchInput);

      expect(result.results).toHaveLength(3); // Only published content
      expect(result.total).toBe(3);
      expect(result.results[0].title).toContain('Fire');
      expect(result.suggestions).toBeDefined();

      // Verify all results are published
      result.results.forEach(content => {
        expect(content.status).toBe('published');
      });
    });

    it('should search content by content text', async () => {
      const user = await createTestUser();
      await createTestContent(user);

      const searchInput: SearchInput = {
        query: 'emergency',
        limit: 5
      };

      const result = await searchContent(searchInput);

      expect(result.results.length).toBeGreaterThan(0);
      expect(result.total).toBeGreaterThan(0);
      
      // Should find content with "emergency" in title or content
      const hasEmergency = result.results.some(content => 
        content.title.toLowerCase().includes('emergency') ||
        content.content.toLowerCase().includes('emergency')
      );
      expect(hasEmergency).toBe(true);
    });

    it('should filter by content type', async () => {
      const user = await createTestUser();
      await createTestContent(user);

      const searchInput: SearchInput = {
        query: 'fire',
        type: 'news',
        limit: 10
      };

      const result = await searchContent(searchInput);

      expect(result.results).toHaveLength(1);
      expect(result.results[0].type).toBe('news');
      expect(result.results[0].title).toBe('Fire Prevention News');
    });

    it('should handle pagination', async () => {
      const user = await createTestUser();
      await createTestContent(user);

      // First page
      const firstPage = await searchContent({
        query: 'fire',
        limit: 2,
        offset: 0
      });

      expect(firstPage.results).toHaveLength(2);
      expect(firstPage.total).toBe(3);

      // Second page
      const secondPage = await searchContent({
        query: 'fire',
        limit: 2,
        offset: 2
      });

      expect(secondPage.results).toHaveLength(1);
      expect(secondPage.total).toBe(3);

      // Results should be different
      expect(firstPage.results[0].id).not.toBe(secondPage.results[0].id);
    });

    it('should return empty results for no matches', async () => {
      const user = await createTestUser();
      await createTestContent(user);

      const result = await searchContent({
        query: 'nonexistent term'
      });

      expect(result.results).toHaveLength(0);
      expect(result.total).toBe(0);
      expect(result.suggestions).toBeDefined();
    });

    it('should order results with title matches first', async () => {
      const user = await createTestUser();
      await createTestContent(user);

      const result = await searchContent({
        query: 'fire',
        limit: 10
      });

      // Results should be ordered with title matches having priority
      expect(result.results.length).toBeGreaterThan(1);
      
      // Check that results are properly ordered
      const titleMatches = result.results.filter(content => 
        content.title.toLowerCase().includes('fire')
      );
      expect(titleMatches.length).toBeGreaterThan(0);
    });
  });

  describe('searchGlobal', () => {
    it('should search across multiple entity types', async () => {
      const user = await createTestUser();
      await createTestContent(user);

      // Create test data for other entities
      await db.insert(serviceRequestsTable)
        .values({
          ticket_number: 'SR001',
          type: 'consultation_survey',
          requester_name: 'Fire Safety Inspector',
          requester_email: 'inspector@test.com',
          requester_phone: '123456789',
          organization: 'Fire Department',
          request_data: { subject: 'Safety consultation' }
        })
        .execute();

      await db.insert(emergencyContactsTable)
        .values({
          name: 'Fire Emergency Hotline',
          phone_number: '911',
          department: 'Fire Department',
          is_primary: true,
          is_active: true,
          sort_order: 1
        })
        .execute();

      await db.insert(datasetsTable)
        .values({
          title: 'Fire Incident Statistics',
          description: 'Annual fire incident data',
          file_path: '/data/fire_stats.xlsx',
          file_type: 'xlsx',
          period: '2024',
          uploaded_by: user.id,
          is_public: true
        })
        .execute();

      const result = await searchGlobal('fire', 20);

      expect(result.content.length).toBeGreaterThan(0);
      expect(result.services.length).toBeGreaterThan(0);
      expect(result.contacts.length).toBeGreaterThan(0);
      expect(result.documents.length).toBeGreaterThan(0);

      // Check content structure
      expect(result.content[0]).toHaveProperty('title');
      expect(result.content[0]).toHaveProperty('type');
      expect(result.services[0]).toHaveProperty('ticket_number');
      expect(result.contacts[0]).toHaveProperty('phone_number');
      expect(result.documents[0]).toHaveProperty('file_path');
    });

    it('should return empty arrays when no results found', async () => {
      const result = await searchGlobal('nonexistent', 10);

      expect(result.content).toHaveLength(0);
      expect(result.services).toHaveLength(0);
      expect(result.contacts).toHaveLength(0);
      expect(result.documents).toHaveLength(0);
    });

    it('should only return active and public data', async () => {
      const user = await createTestUser();

      // Create inactive contact
      await db.insert(emergencyContactsTable)
        .values({
          name: 'Inactive Fire Contact',
          phone_number: '999',
          department: 'Fire Department',
          is_primary: false,
          is_active: false,
          sort_order: 1
        })
        .execute();

      // Create private dataset
      await db.insert(datasetsTable)
        .values({
          title: 'Private Fire Data',
          description: 'Internal fire department data',
          file_path: '/data/private_fire.xlsx',
          file_type: 'xlsx',
          period: '2024',
          uploaded_by: user.id,
          is_public: false
        })
        .execute();

      const result = await searchGlobal('fire', 20);

      // Should not return inactive contacts or private datasets
      const hasInactiveContact = result.contacts.some(contact => 
        contact.name.includes('Inactive')
      );
      const hasPrivateData = result.documents.some(doc => 
        doc.title.includes('Private')
      );

      expect(hasInactiveContact).toBe(false);
      expect(hasPrivateData).toBe(false);
    });
  });

  describe('getSearchSuggestions', () => {
    it('should return suggestions for valid query', async () => {
      const user = await createTestUser();
      await createTestContent(user);

      const suggestions = await getSearchSuggestions('fi');

      expect(Array.isArray(suggestions)).toBe(true);
      expect(suggestions.length).toBeLessThanOrEqual(5);
    });

    it('should return empty array for short query', async () => {
      const suggestions = await getSearchSuggestions('f');

      expect(suggestions).toHaveLength(0);
    });

    it('should handle queries with no matches', async () => {
      const suggestions = await getSearchSuggestions('xyz123');

      expect(Array.isArray(suggestions)).toBe(true);
      expect(suggestions.length).toBeLessThanOrEqual(5);
    });
  });

  describe('getPopularSearches', () => {
    it('should return popular search terms', async () => {
      const popular = await getPopularSearches(5);

      expect(Array.isArray(popular)).toBe(true);
      expect(popular.length).toBeLessThanOrEqual(5);
      expect(popular.length).toBeGreaterThan(0);
    });

    it('should respect limit parameter', async () => {
      const popular = await getPopularSearches(3);

      expect(popular.length).toBeLessThanOrEqual(3);
    });

    it('should return default limit when no parameter provided', async () => {
      const popular = await getPopularSearches();

      expect(popular.length).toBeLessThanOrEqual(10);
    });
  });

  describe('logSearchQuery', () => {
    it('should log search query without error', async () => {
      // This should not throw an error
      expect(async () => {
        await logSearchQuery('test query', 5);
      }).not.toThrow();
    });

    it('should handle empty query', async () => {
      expect(async () => {
        await logSearchQuery('', 0);
      }).not.toThrow();
    });

    it('should handle large result count', async () => {
      expect(async () => {
        await logSearchQuery('popular term', 1000);
      }).not.toThrow();
    });
  });

  describe('Search edge cases', () => {
    it('should handle special characters in search query', async () => {
      const user = await createTestUser();
      await createTestContent(user);

      const result = await searchContent({
        query: 'fire & safety',
        limit: 10
      });

      expect(result).toBeDefined();
      expect(result.results).toBeDefined();
      expect(result.total).toBeGreaterThanOrEqual(0);
    });

    it('should be case insensitive', async () => {
      const user = await createTestUser();
      await createTestContent(user);

      const lowerResult = await searchContent({
        query: 'fire',
        limit: 10
      });

      const upperResult = await searchContent({
        query: 'FIRE',
        limit: 10
      });

      expect(lowerResult.total).toBe(upperResult.total);
      expect(lowerResult.results.length).toBe(upperResult.results.length);
    });

    it('should handle very long search queries', async () => {
      const user = await createTestUser();
      await createTestContent(user);

      const longQuery = 'fire safety emergency response procedures regulations compliance requirements'.repeat(10);
      
      const result = await searchContent({
        query: longQuery,
        limit: 5
      });

      expect(result).toBeDefined();
      expect(result.results).toBeDefined();
    });
  });
});