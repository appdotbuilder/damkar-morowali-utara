import { 
  serial, 
  text, 
  pgTable, 
  timestamp, 
  integer,
  boolean,
  jsonb,
  varchar,
  pgEnum
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const userRoleEnum = pgEnum('user_role', [
  'super_admin',
  'editor', 
  'contributor',
  'service_officer',
  'ppid_admin',
  'internal_viewer'
]);

export const contentStatusEnum = pgEnum('content_status', ['draft', 'published', 'archived']);
export const contentTypeEnum = pgEnum('content_type', ['news', 'press_release', 'page', 'educational_material', 'regulation', 'sop']);
export const serviceTypeEnum = pgEnum('service_type', ['education_simulation', 'fire_protection_recommendation', 'consultation_survey', 'non_emergency_complaint']);
export const serviceStatusEnum = pgEnum('service_status', ['submitted', 'under_review', 'in_progress', 'completed', 'rejected']);
export const ppidRequestStatusEnum = pgEnum('ppid_request_status', ['submitted', 'under_review', 'approved', 'rejected', 'partially_approved']);
export const informationClassificationEnum = pgEnum('information_classification', ['available_anytime', 'available_on_request', 'excluded']);
export const mediaTypeEnum = pgEnum('media_type', ['image', 'video', 'document']);

// Users table
export const usersTable = pgTable('users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 50 }).notNull().unique(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password_hash: text('password_hash').notNull(),
  full_name: varchar('full_name', { length: 255 }).notNull(),
  role: userRoleEnum('role').notNull(),
  is_active: boolean('is_active').notNull().default(true),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Categories table
export const categoriesTable = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description'),
  parent_id: integer('parent_id'),
  created_at: timestamp('created_at').defaultNow().notNull()
});

// Tags table
export const tagsTable = pgTable('tags', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  created_at: timestamp('created_at').defaultNow().notNull()
});

// Content table
export const contentTable = pgTable('content', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 500 }).notNull(),
  slug: varchar('slug', { length: 500 }).notNull().unique(),
  content: text('content').notNull(),
  excerpt: text('excerpt'),
  type: contentTypeEnum('type').notNull(),
  status: contentStatusEnum('status').notNull().default('draft'),
  featured_image: text('featured_image'),
  meta_title: varchar('meta_title', { length: 255 }),
  meta_description: text('meta_description'),
  author_id: integer('author_id').notNull(),
  published_at: timestamp('published_at'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Content categories junction table
export const contentCategoriesTable = pgTable('content_categories', {
  id: serial('id').primaryKey(),
  content_id: integer('content_id').notNull(),
  category_id: integer('category_id').notNull()
});

// Content tags junction table
export const contentTagsTable = pgTable('content_tags', {
  id: serial('id').primaryKey(),
  content_id: integer('content_id').notNull(),
  tag_id: integer('tag_id').notNull()
});

// Service requests table
export const serviceRequestsTable = pgTable('service_requests', {
  id: serial('id').primaryKey(),
  ticket_number: varchar('ticket_number', { length: 50 }).notNull().unique(),
  type: serviceTypeEnum('type').notNull(),
  status: serviceStatusEnum('status').notNull().default('submitted'),
  requester_name: varchar('requester_name', { length: 255 }).notNull(),
  requester_email: varchar('requester_email', { length: 255 }).notNull(),
  requester_phone: varchar('requester_phone', { length: 50 }).notNull(),
  organization: varchar('organization', { length: 255 }),
  request_data: jsonb('request_data').notNull(),
  notes: text('notes'),
  assigned_to: integer('assigned_to'),
  submitted_at: timestamp('submitted_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
  completed_at: timestamp('completed_at')
});

// PPID requests table
export const ppidRequestsTable = pgTable('ppid_requests', {
  id: serial('id').primaryKey(),
  request_number: varchar('request_number', { length: 50 }).notNull().unique(),
  requester_name: varchar('requester_name', { length: 255 }).notNull(),
  requester_email: varchar('requester_email', { length: 255 }).notNull(),
  requester_phone: varchar('requester_phone', { length: 50 }).notNull(),
  id_number: varchar('id_number', { length: 50 }).notNull(),
  information_requested: text('information_requested').notNull(),
  purpose: text('purpose').notNull(),
  status: ppidRequestStatusEnum('status').notNull().default('submitted'),
  response_data: text('response_data'),
  decision_reason: text('decision_reason'),
  assigned_to: integer('assigned_to'),
  submitted_at: timestamp('submitted_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
  responded_at: timestamp('responded_at')
});

// Media table
export const mediaTable = pgTable('media', {
  id: serial('id').primaryKey(),
  filename: varchar('filename', { length: 255 }).notNull(),
  original_name: varchar('original_name', { length: 255 }).notNull(),
  file_path: text('file_path').notNull(),
  file_size: integer('file_size').notNull(),
  mime_type: varchar('mime_type', { length: 100 }).notNull(),
  type: mediaTypeEnum('type').notNull(),
  alt_text: text('alt_text'),
  caption: text('caption'),
  uploaded_by: integer('uploaded_by').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull()
});

// Gallery table
export const galleryTable = pgTable('gallery', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  media_id: integer('media_id').notNull(),
  category_id: integer('category_id'),
  is_featured: boolean('is_featured').notNull().default(false),
  sort_order: integer('sort_order').notNull().default(0),
  created_at: timestamp('created_at').defaultNow().notNull()
});

// Datasets table
export const datasetsTable = pgTable('datasets', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  file_path: text('file_path').notNull(),
  file_type: varchar('file_type', { length: 50 }).notNull(),
  period: varchar('period', { length: 100 }).notNull(),
  uploaded_by: integer('uploaded_by').notNull(),
  is_public: boolean('is_public').notNull().default(true),
  created_at: timestamp('created_at').defaultNow().notNull()
});

// Emergency contacts table
export const emergencyContactsTable = pgTable('emergency_contacts', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  phone_number: varchar('phone_number', { length: 50 }).notNull(),
  whatsapp_number: varchar('whatsapp_number', { length: 50 }),
  department: varchar('department', { length: 255 }),
  is_primary: boolean('is_primary').notNull().default(false),
  is_active: boolean('is_active').notNull().default(true),
  sort_order: integer('sort_order').notNull().default(0),
  created_at: timestamp('created_at').defaultNow().notNull()
});

// Relations
export const usersRelations = relations(usersTable, ({ many }) => ({
  content: many(contentTable),
  serviceRequests: many(serviceRequestsTable),
  ppidRequests: many(ppidRequestsTable),
  media: many(mediaTable),
  datasets: many(datasetsTable)
}));

export const categoriesRelations = relations(categoriesTable, ({ one, many }) => ({
  parent: one(categoriesTable, {
    fields: [categoriesTable.parent_id],
    references: [categoriesTable.id]
  }),
  children: many(categoriesTable),
  contentCategories: many(contentCategoriesTable),
  galleryItems: many(galleryTable)
}));

export const contentRelations = relations(contentTable, ({ one, many }) => ({
  author: one(usersTable, {
    fields: [contentTable.author_id],
    references: [usersTable.id]
  }),
  contentCategories: many(contentCategoriesTable),
  contentTags: many(contentTagsTable)
}));

export const contentCategoriesRelations = relations(contentCategoriesTable, ({ one }) => ({
  content: one(contentTable, {
    fields: [contentCategoriesTable.content_id],
    references: [contentTable.id]
  }),
  category: one(categoriesTable, {
    fields: [contentCategoriesTable.category_id],
    references: [categoriesTable.id]
  })
}));

export const contentTagsRelations = relations(contentTagsTable, ({ one }) => ({
  content: one(contentTable, {
    fields: [contentTagsTable.content_id],
    references: [contentTable.id]
  }),
  tag: one(tagsTable, {
    fields: [contentTagsTable.tag_id],
    references: [tagsTable.id]
  })
}));

export const tagsRelations = relations(tagsTable, ({ many }) => ({
  contentTags: many(contentTagsTable)
}));

export const serviceRequestsRelations = relations(serviceRequestsTable, ({ one }) => ({
  assignee: one(usersTable, {
    fields: [serviceRequestsTable.assigned_to],
    references: [usersTable.id]
  })
}));

export const ppidRequestsRelations = relations(ppidRequestsTable, ({ one }) => ({
  assignee: one(usersTable, {
    fields: [ppidRequestsTable.assigned_to],
    references: [usersTable.id]
  })
}));

export const mediaRelations = relations(mediaTable, ({ one, many }) => ({
  uploader: one(usersTable, {
    fields: [mediaTable.uploaded_by],
    references: [usersTable.id]
  }),
  galleryItems: many(galleryTable)
}));

export const galleryRelations = relations(galleryTable, ({ one }) => ({
  media: one(mediaTable, {
    fields: [galleryTable.media_id],
    references: [mediaTable.id]
  }),
  category: one(categoriesTable, {
    fields: [galleryTable.category_id],
    references: [categoriesTable.id]
  })
}));

export const datasetsRelations = relations(datasetsTable, ({ one }) => ({
  uploader: one(usersTable, {
    fields: [datasetsTable.uploaded_by],
    references: [usersTable.id]
  })
}));

// Export all tables for proper query building
export const tables = {
  users: usersTable,
  categories: categoriesTable,
  tags: tagsTable,
  content: contentTable,
  contentCategories: contentCategoriesTable,
  contentTags: contentTagsTable,
  serviceRequests: serviceRequestsTable,
  ppidRequests: ppidRequestsTable,
  media: mediaTable,
  gallery: galleryTable,
  datasets: datasetsTable,
  emergencyContacts: emergencyContactsTable
};