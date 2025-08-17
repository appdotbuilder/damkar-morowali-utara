import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';
import { z } from 'zod';

// Import schemas
import { 
  createUserInputSchema,
  createContentInputSchema,
  contentFilterInputSchema,
  createServiceRequestInputSchema,
  updateServiceRequestInputSchema,
  createPPIDRequestInputSchema,
  searchInputSchema
} from './schema';

// Import handlers
import { createUser, getUserById, authenticateUser } from './handlers/auth';
import { 
  createContent, 
  getContentById, 
  getContentList, 
  updateContent, 
  deleteContent, 
  getPublishedContent 
} from './handlers/content';
import { 
  createServiceRequest, 
  getServiceRequestById, 
  getServiceRequestByTicket,
  updateServiceRequest, 
  getServiceRequests, 
  assignServiceRequest 
} from './handlers/services';
import { 
  createPPIDRequest, 
  getPPIDRequestById, 
  getPPIDRequestByNumber,
  updatePPIDRequest, 
  getPPIDRequests, 
  assignPPIDRequest,
  getPPIDStatistics 
} from './handlers/ppid';
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
} from './handlers/media';
import { 
  createCategory, 
  getCategoryById, 
  getCategoryBySlug, 
  getCategories, 
  getCategoryTree, 
  updateCategory, 
  deleteCategory 
} from './handlers/categories';
import { searchContent, searchGlobal, getSearchSuggestions } from './handlers/search';
import { 
  getEmergencyContacts, 
  getPrimaryEmergencyContacts, 
  createEmergencyContact, 
  updateEmergencyContact, 
  deleteEmergencyContact 
} from './handlers/emergency';
import { 
  uploadDataset, 
  getDatasets, 
  getDatasetById, 
  updateDataset, 
  deleteDataset, 
  getDatasetVisualization 
} from './handlers/datasets';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  // Health check
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  // Authentication routes
  auth: router({
    createUser: publicProcedure
      .input(createUserInputSchema)
      .mutation(({ input }) => createUser(input)),
    
    getUserById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(({ input }) => getUserById(input.id)),
    
    authenticate: publicProcedure
      .input(z.object({ username: z.string(), password: z.string() }))
      .mutation(({ input }) => authenticateUser(input.username, input.password)),
  }),

  // Content management routes
  content: router({
    create: publicProcedure
      .input(createContentInputSchema)
      .mutation(({ input }) => createContent(input, 1)), // TODO: Get actual user ID from context
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(({ input }) => getContentById(input.id)),
    
    getList: publicProcedure
      .input(contentFilterInputSchema)
      .query(({ input }) => getContentList(input)),
    
    getPublished: publicProcedure
      .input(z.object({ type: z.string().optional(), limit: z.number().optional() }))
      .query(({ input }) => getPublishedContent(input.type as any, input.limit)),
    
    update: publicProcedure
      .input(z.object({ id: z.number() }).merge(createContentInputSchema.partial()))
      .mutation(({ input }) => {
        const { id, ...updates } = input;
        return updateContent(id, updates);
      }),
    
    delete: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input }) => deleteContent(input.id)),
  }),

  // Public services routes
  services: router({
    createRequest: publicProcedure
      .input(createServiceRequestInputSchema)
      .mutation(({ input }) => createServiceRequest(input)),
    
    getRequestById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(({ input }) => getServiceRequestById(input.id)),
    
    getRequestByTicket: publicProcedure
      .input(z.object({ ticketNumber: z.string() }))
      .query(({ input }) => getServiceRequestByTicket(input.ticketNumber)),
    
    updateRequest: publicProcedure
      .input(updateServiceRequestInputSchema)
      .mutation(({ input }) => updateServiceRequest(input)),
    
    getRequests: publicProcedure
      .input(z.object({ 
        status: z.string().optional(), 
        type: z.string().optional(),
        assignedTo: z.number().optional(),
        limit: z.number().optional() 
      }))
      .query(({ input }) => getServiceRequests(input.status as any, input.type as any, input.assignedTo, input.limit)),
    
    assign: publicProcedure
      .input(z.object({ id: z.number(), assigneeId: z.number() }))
      .mutation(({ input }) => assignServiceRequest(input.id, input.assigneeId)),
  }),

  // PPID routes
  ppid: router({
    createRequest: publicProcedure
      .input(createPPIDRequestInputSchema)
      .mutation(({ input }) => createPPIDRequest(input)),
    
    getRequestById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(({ input }) => getPPIDRequestById(input.id)),
    
    getRequestByNumber: publicProcedure
      .input(z.object({ requestNumber: z.string() }))
      .query(({ input }) => getPPIDRequestByNumber(input.requestNumber)),
    
    updateRequest: publicProcedure
      .input(z.object({ 
        id: z.number(), 
        status: z.string(), 
        responseData: z.string().optional(),
        decisionReason: z.string().optional() 
      }))
      .mutation(({ input }) => updatePPIDRequest(input.id, input.status as any, input.responseData, input.decisionReason)),
    
    getRequests: publicProcedure
      .input(z.object({ 
        status: z.string().optional(),
        assignedTo: z.number().optional(),
        limit: z.number().optional() 
      }))
      .query(({ input }) => getPPIDRequests(input.status as any, input.assignedTo, input.limit)),
    
    assign: publicProcedure
      .input(z.object({ id: z.number(), assigneeId: z.number() }))
      .mutation(({ input }) => assignPPIDRequest(input.id, input.assigneeId)),
    
    getStatistics: publicProcedure
      .query(() => getPPIDStatistics()),
  }),

  // Media and gallery routes
  media: router({
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(({ input }) => getMediaById(input.id)),
    
    getList: publicProcedure
      .input(z.object({ 
        type: z.string().optional(),
        uploadedBy: z.number().optional(),
        limit: z.number().optional() 
      }))
      .query(({ input }) => getMediaList(input.type as any, input.uploadedBy, input.limit)),
    
    updateMetadata: publicProcedure
      .input(z.object({ id: z.number(), altText: z.string().optional(), caption: z.string().optional() }))
      .mutation(({ input }) => updateMediaMetadata(input.id, input.altText, input.caption)),
    
    delete: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input }) => deleteMedia(input.id)),
  }),

  // Gallery routes
  gallery: router({
    createItem: publicProcedure
      .input(z.object({ 
        title: z.string(),
        mediaId: z.number(),
        description: z.string().optional(),
        categoryId: z.number().optional(),
        isFeatured: z.boolean().optional() 
      }))
      .mutation(({ input }) => createGalleryItem(input.title, input.mediaId, input.description, input.categoryId, input.isFeatured)),
    
    getItems: publicProcedure
      .input(z.object({ 
        categoryId: z.number().optional(),
        isFeatured: z.boolean().optional(),
        limit: z.number().optional() 
      }))
      .query(({ input }) => getGalleryItems(input.categoryId, input.isFeatured, input.limit)),
    
    updateItem: publicProcedure
      .input(z.object({ 
        id: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        categoryId: z.number().optional(),
        isFeatured: z.boolean().optional(),
        sortOrder: z.number().optional() 
      }))
      .mutation(({ input }) => {
        const { id, ...updates } = input;
        return updateGalleryItem(id, updates);
      }),
    
    deleteItem: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input }) => deleteGalleryItem(input.id)),
  }),

  // Category routes
  categories: router({
    create: publicProcedure
      .input(z.object({ 
        name: z.string(),
        description: z.string().optional(),
        parentId: z.number().optional() 
      }))
      .mutation(({ input }) => createCategory(input.name, input.description, input.parentId)),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(({ input }) => getCategoryById(input.id)),
    
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(({ input }) => getCategoryBySlug(input.slug)),
    
    getList: publicProcedure
      .input(z.object({ parentId: z.number().optional() }))
      .query(({ input }) => getCategories(input.parentId)),
    
    getTree: publicProcedure
      .query(() => getCategoryTree()),
    
    update: publicProcedure
      .input(z.object({ 
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        parentId: z.number().optional() 
      }))
      .mutation(({ input }) => {
        const { id, ...updates } = input;
        return updateCategory(id, updates);
      }),
    
    delete: publicProcedure
      .input(z.object({ id: z.number(), reassignToId: z.number().optional() }))
      .mutation(({ input }) => deleteCategory(input.id, input.reassignToId)),
  }),

  // Search routes
  search: router({
    content: publicProcedure
      .input(searchInputSchema)
      .query(({ input }) => searchContent(input)),
    
    global: publicProcedure
      .input(z.object({ query: z.string(), limit: z.number().optional() }))
      .query(({ input }) => searchGlobal(input.query, input.limit)),
    
    suggestions: publicProcedure
      .input(z.object({ query: z.string() }))
      .query(({ input }) => getSearchSuggestions(input.query)),
  }),

  // Emergency contacts routes
  emergency: router({
    getContacts: publicProcedure
      .query(() => getEmergencyContacts()),
    
    getPrimaryContacts: publicProcedure
      .query(() => getPrimaryEmergencyContacts()),
    
    createContact: publicProcedure
      .input(z.object({ 
        name: z.string(),
        phoneNumber: z.string(),
        whatsappNumber: z.string().optional(),
        department: z.string().optional(),
        isPrimary: z.boolean().optional() 
      }))
      .mutation(({ input }) => createEmergencyContact(input.name, input.phoneNumber, input.whatsappNumber, input.department, input.isPrimary)),
    
    updateContact: publicProcedure
      .input(z.object({ 
        id: z.number(),
        name: z.string().optional(),
        phoneNumber: z.string().optional(),
        whatsappNumber: z.string().optional(),
        department: z.string().optional(),
        isPrimary: z.boolean().optional(),
        isActive: z.boolean().optional(),
        sortOrder: z.number().optional() 
      }))
      .mutation(({ input }) => {
        const { id, ...updates } = input;
        return updateEmergencyContact(id, updates);
      }),
    
    deleteContact: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input }) => deleteEmergencyContact(input.id)),
  }),

  // Dataset routes
  datasets: router({
    getList: publicProcedure
      .input(z.object({ isPublic: z.boolean().optional(), limit: z.number().optional() }))
      .query(({ input }) => getDatasets(input.isPublic, input.limit)),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(({ input }) => getDatasetById(input.id)),
    
    update: publicProcedure
      .input(z.object({ 
        id: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        period: z.string().optional(),
        isPublic: z.boolean().optional() 
      }))
      .mutation(({ input }) => {
        const { id, ...updates } = input;
        return updateDataset(id, updates);
      }),
    
    delete: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input }) => deleteDataset(input.id)),
    
    getVisualization: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(({ input }) => getDatasetVisualization(input.id)),
  }),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`🚒 Morowali Utara Fire Department TRPC server listening at port: ${port}`);
}

start();