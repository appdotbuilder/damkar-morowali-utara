import { db } from '../db';
import { 
  contentTable, 
  serviceRequestsTable, 
  emergencyContactsTable, 
  datasetsTable,
  usersTable
} from '../db/schema';
import { 
  type SearchInput, 
  type Content, 
  type ServiceRequest, 
  type EmergencyContact,
  type Dataset
} from '../schema';
import { 
  eq, 
  ilike, 
  or, 
  and, 
  desc, 
  count, 
  sql 
} from 'drizzle-orm';

export async function searchContent(input: SearchInput): Promise<{
    results: Content[];
    total: number;
    suggestions?: string[];
}> {
    try {
        const { query, type, limit = 10, offset = 0 } = input;
        
        // Build base query
        let baseQuery = db.select().from(contentTable);
        
        // Build search conditions
        const searchConditions = [
            ilike(contentTable.title, `%${query}%`),
            ilike(contentTable.content, `%${query}%`),
            ilike(contentTable.excerpt, `%${query}%`)
        ];

        const conditions = [];
        
        // Add text search condition
        conditions.push(or(...searchConditions));
        
        // Add type filter if specified
        if (type && type !== 'all') {
            if (type === 'news') {
                conditions.push(eq(contentTable.type, 'news'));
            } else if (type === 'pages') {
                conditions.push(eq(contentTable.type, 'page'));
            }
        }
        
        // Only show published content in search results
        conditions.push(eq(contentTable.status, 'published'));

        // Apply filters
        const filteredQuery = baseQuery.where(and(...conditions));

        // Get total count
        const [totalResult] = await db.select({ count: count() })
            .from(contentTable)
            .where(and(...conditions))
            .execute();

        const total = totalResult.count;

        // Get paginated results with ordering by relevance (title matches first)
        const results = await filteredQuery
            .orderBy(
                // Title matches get higher priority
                sql`CASE 
                    WHEN ${contentTable.title} ILIKE ${`%${query}%`} THEN 1 
                    ELSE 2 
                END`,
                desc(contentTable.published_at),
                desc(contentTable.created_at)
            )
            .limit(limit)
            .offset(offset)
            .execute();

        // Generate simple suggestions based on search terms
        const suggestions = await generateSearchSuggestions(query);

        return {
            results,
            total,
            suggestions
        };
    } catch (error) {
        console.error('Content search failed:', error);
        throw error;
    }
}

export async function searchGlobal(query: string, limit: number = 20): Promise<{
    content: Content[];
    services: ServiceRequest[];
    contacts: EmergencyContact[];
    documents: Dataset[];
}> {
    try {
        const itemsPerCategory = Math.ceil(limit / 4);

        // Search content
        const contentResults = await db.select()
            .from(contentTable)
            .where(and(
                or(
                    ilike(contentTable.title, `%${query}%`),
                    ilike(contentTable.content, `%${query}%`),
                    ilike(contentTable.excerpt, `%${query}%`)
                ),
                eq(contentTable.status, 'published')
            ))
            .orderBy(desc(contentTable.published_at))
            .limit(itemsPerCategory)
            .execute();

        // Search service requests (for public service information)
        const serviceResults = await db.select()
            .from(serviceRequestsTable)
            .where(or(
                ilike(serviceRequestsTable.requester_name, `%${query}%`),
                ilike(serviceRequestsTable.organization, `%${query}%`),
                ilike(serviceRequestsTable.notes, `%${query}%`)
            ))
            .orderBy(desc(serviceRequestsTable.submitted_at))
            .limit(itemsPerCategory)
            .execute();

        // Convert request_data to proper type
        const typedServiceResults = serviceResults.map(service => ({
            ...service,
            request_data: service.request_data as Record<string, any>
        }));

        // Search emergency contacts
        const contactResults = await db.select()
            .from(emergencyContactsTable)
            .where(and(
                or(
                    ilike(emergencyContactsTable.name, `%${query}%`),
                    ilike(emergencyContactsTable.department, `%${query}%`)
                ),
                eq(emergencyContactsTable.is_active, true)
            ))
            .orderBy(desc(emergencyContactsTable.is_primary), emergencyContactsTable.sort_order)
            .limit(itemsPerCategory)
            .execute();

        // Search datasets/documents
        const documentResults = await db.select()
            .from(datasetsTable)
            .where(and(
                or(
                    ilike(datasetsTable.title, `%${query}%`),
                    ilike(datasetsTable.description, `%${query}%`),
                    ilike(datasetsTable.period, `%${query}%`)
                ),
                eq(datasetsTable.is_public, true)
            ))
            .orderBy(desc(datasetsTable.created_at))
            .limit(itemsPerCategory)
            .execute();

        return {
            content: contentResults,
            services: typedServiceResults,
            contacts: contactResults,
            documents: documentResults
        };
    } catch (error) {
        console.error('Global search failed:', error);
        throw error;
    }
}

export async function getSearchSuggestions(query: string): Promise<string[]> {
    try {
        if (query.length < 2) {
            return [];
        }

        // Get suggestions from content titles and popular terms
        const suggestions = await generateSearchSuggestions(query);
        
        return suggestions.slice(0, 5);
    } catch (error) {
        console.error('Search suggestions failed:', error);
        throw error;
    }
}

export async function getPopularSearches(limit: number = 10): Promise<string[]> {
    try {
        // Since we don't have a search log table yet, return some common terms
        // In a real implementation, this would query a search_logs table
        const popularTerms = [
            'peraturan',
            'layanan',
            'berita',
            'kontak darurat',
            'simulasi',
            'rekomendasi',
            'konsultasi',
            'pengaduan',
            'data statistik',
            'informasi publik'
        ];

        return popularTerms.slice(0, limit);
    } catch (error) {
        console.error('Popular searches failed:', error);
        throw error;
    }
}

export async function logSearchQuery(query: string, resultCount: number): Promise<void> {
    try {
        // In a real implementation, this would insert into a search_logs table
        // For now, we'll just log to console for development
        console.log(`Search logged: "${query}" - ${resultCount} results`);
        
        // Future implementation would be:
        // await db.insert(searchLogsTable).values({
        //     query,
        //     result_count: resultCount,
        //     searched_at: new Date()
        // }).execute();
        
        return Promise.resolve();
    } catch (error) {
        console.error('Search logging failed:', error);
        throw error;
    }
}

// Helper function to generate search suggestions
async function generateSearchSuggestions(query: string): Promise<string[]> {
    try {
        // Get content titles that partially match the query
        const titleSuggestions = await db.select({
            title: contentTable.title
        })
        .from(contentTable)
        .where(and(
            ilike(contentTable.title, `%${query}%`),
            eq(contentTable.status, 'published')
        ))
        .limit(10)
        .execute();

        // Extract unique words from titles for suggestions
        const suggestions = new Set<string>();
        
        titleSuggestions.forEach(item => {
            const words = item.title.toLowerCase().split(/\s+/);
            words.forEach(word => {
                // Clean word and add if it contains the query
                const cleanWord = word.replace(/[^\w]/g, '');
                if (cleanWord.length > 2 && cleanWord.includes(query.toLowerCase())) {
                    suggestions.add(cleanWord);
                }
            });
        });

        return Array.from(suggestions).slice(0, 5);
    } catch (error) {
        console.error('Generating suggestions failed:', error);
        return [];
    }
}