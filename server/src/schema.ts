import { z } from 'zod';

// User and Authentication schemas
export const userRoleEnum = z.enum([
  'super_admin',
  'editor', 
  'contributor',
  'service_officer',
  'ppid_admin',
  'internal_viewer'
]);

export const userSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string().email(),
  full_name: z.string(),
  role: userRoleEnum,
  is_active: z.boolean(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type User = z.infer<typeof userSchema>;
export type UserRole = z.infer<typeof userRoleEnum>;

// Content Management schemas
export const contentStatusEnum = z.enum(['draft', 'published', 'archived']);
export const contentTypeEnum = z.enum(['news', 'press_release', 'page', 'educational_material', 'regulation', 'sop']);

export const contentSchema = z.object({
  id: z.number(),
  title: z.string(),
  slug: z.string(),
  content: z.string(),
  excerpt: z.string().nullable(),
  type: contentTypeEnum,
  status: contentStatusEnum,
  featured_image: z.string().nullable(),
  meta_title: z.string().nullable(),
  meta_description: z.string().nullable(),
  author_id: z.number(),
  published_at: z.coerce.date().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Content = z.infer<typeof contentSchema>;
export type ContentStatus = z.infer<typeof contentStatusEnum>;
export type ContentType = z.infer<typeof contentTypeEnum>;

export const categorySchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  parent_id: z.number().nullable(),
  created_at: z.coerce.date()
});

export type Category = z.infer<typeof categorySchema>;

export const tagSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  created_at: z.coerce.date()
});

export type Tag = z.infer<typeof tagSchema>;

// Public Services schemas
export const serviceTypeEnum = z.enum([
  'education_simulation',
  'fire_protection_recommendation', 
  'consultation_survey',
  'non_emergency_complaint'
]);

export const serviceStatusEnum = z.enum([
  'submitted',
  'under_review',
  'in_progress',
  'completed',
  'rejected'
]);

export const serviceRequestSchema = z.object({
  id: z.number(),
  ticket_number: z.string(),
  type: serviceTypeEnum,
  status: serviceStatusEnum,
  requester_name: z.string(),
  requester_email: z.string().email(),
  requester_phone: z.string(),
  organization: z.string().nullable(),
  request_data: z.record(z.any()), // JSON field for flexible data
  notes: z.string().nullable(),
  assigned_to: z.number().nullable(),
  submitted_at: z.coerce.date(),
  updated_at: z.coerce.date(),
  completed_at: z.coerce.date().nullable()
});

export type ServiceRequest = z.infer<typeof serviceRequestSchema>;
export type ServiceType = z.infer<typeof serviceTypeEnum>;
export type ServiceStatus = z.infer<typeof serviceStatusEnum>;

// PPID (Public Information Disclosure) schemas
export const informationClassificationEnum = z.enum([
  'available_anytime',
  'available_on_request',
  'excluded'
]);

export const ppidRequestStatusEnum = z.enum([
  'submitted',
  'under_review',
  'approved',
  'rejected',
  'partially_approved'
]);

export const ppidRequestSchema = z.object({
  id: z.number(),
  request_number: z.string(),
  requester_name: z.string(),
  requester_email: z.string().email(),
  requester_phone: z.string(),
  id_number: z.string(),
  information_requested: z.string(),
  purpose: z.string(),
  status: ppidRequestStatusEnum,
  response_data: z.string().nullable(),
  decision_reason: z.string().nullable(),
  assigned_to: z.number().nullable(),
  submitted_at: z.coerce.date(),
  updated_at: z.coerce.date(),
  responded_at: z.coerce.date().nullable()
});

export type PPIDRequest = z.infer<typeof ppidRequestSchema>;
export type PPIDRequestStatus = z.infer<typeof ppidRequestStatusEnum>;
export type InformationClassification = z.infer<typeof informationClassificationEnum>;

// Gallery and Media schemas
export const mediaTypeEnum = z.enum(['image', 'video', 'document']);

export const mediaSchema = z.object({
  id: z.number(),
  filename: z.string(),
  original_name: z.string(),
  file_path: z.string(),
  file_size: z.number(),
  mime_type: z.string(),
  type: mediaTypeEnum,
  alt_text: z.string().nullable(),
  caption: z.string().nullable(),
  uploaded_by: z.number(),
  created_at: z.coerce.date()
});

export type Media = z.infer<typeof mediaSchema>;
export type MediaType = z.infer<typeof mediaTypeEnum>;

export const gallerySchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().nullable(),
  media_id: z.number(),
  category_id: z.number().nullable(),
  is_featured: z.boolean(),
  sort_order: z.number(),
  created_at: z.coerce.date()
});

export type Gallery = z.infer<typeof gallerySchema>;

// Data & Statistics schemas
export const datasetSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().nullable(),
  file_path: z.string(),
  file_type: z.string(),
  period: z.string(),
  uploaded_by: z.number(),
  is_public: z.boolean(),
  created_at: z.coerce.date()
});

export type Dataset = z.infer<typeof datasetSchema>;

// Emergency and Contact schemas
export const emergencyContactSchema = z.object({
  id: z.number(),
  name: z.string(),
  phone_number: z.string(),
  whatsapp_number: z.string().nullable(),
  department: z.string().nullable(),
  is_primary: z.boolean(),
  is_active: z.boolean(),
  sort_order: z.number(),
  created_at: z.coerce.date()
});

export type EmergencyContact = z.infer<typeof emergencyContactSchema>;

// Input schemas for creating/updating entities
export const createUserInputSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8),
  full_name: z.string(),
  role: userRoleEnum
});

export type CreateUserInput = z.infer<typeof createUserInputSchema>;

export const createContentInputSchema = z.object({
  title: z.string(),
  content: z.string(),
  excerpt: z.string().nullable().optional(),
  type: contentTypeEnum,
  status: contentStatusEnum.optional(),
  featured_image: z.string().nullable().optional(),
  meta_title: z.string().nullable().optional(),
  meta_description: z.string().nullable().optional(),
  category_ids: z.array(z.number()).optional(),
  tag_ids: z.array(z.number()).optional()
});

export type CreateContentInput = z.infer<typeof createContentInputSchema>;

export const createServiceRequestInputSchema = z.object({
  type: serviceTypeEnum,
  requester_name: z.string(),
  requester_email: z.string().email(),
  requester_phone: z.string(),
  organization: z.string().nullable().optional(),
  request_data: z.record(z.any()),
  notes: z.string().nullable().optional()
});

export type CreateServiceRequestInput = z.infer<typeof createServiceRequestInputSchema>;

export const createPPIDRequestInputSchema = z.object({
  requester_name: z.string(),
  requester_email: z.string().email(),
  requester_phone: z.string(),
  id_number: z.string(),
  information_requested: z.string(),
  purpose: z.string()
});

export type CreatePPIDRequestInput = z.infer<typeof createPPIDRequestInputSchema>;

export const updateServiceRequestInputSchema = z.object({
  id: z.number(),
  status: serviceStatusEnum.optional(),
  notes: z.string().nullable().optional(),
  assigned_to: z.number().nullable().optional()
});

export type UpdateServiceRequestInput = z.infer<typeof updateServiceRequestInputSchema>;

// Search and filtering schemas
export const searchInputSchema = z.object({
  query: z.string(),
  type: z.enum(['all', 'news', 'pages', 'services']).optional(),
  limit: z.number().min(1).max(100).optional(),
  offset: z.number().min(0).optional()
});

export type SearchInput = z.infer<typeof searchInputSchema>;

export const contentFilterInputSchema = z.object({
  type: contentTypeEnum.optional(),
  status: contentStatusEnum.optional(),
  category_id: z.number().optional(),
  tag_id: z.number().optional(),
  author_id: z.number().optional(),
  limit: z.number().min(1).max(100).optional(),
  offset: z.number().min(0).optional(),
  sort_by: z.enum(['created_at', 'published_at', 'title']).optional(),
  sort_order: z.enum(['asc', 'desc']).optional()
});

export type ContentFilterInput = z.infer<typeof contentFilterInputSchema>;