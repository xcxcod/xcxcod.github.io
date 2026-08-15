import { z } from "zod";

const professionalEmail = z.string().trim().email("Enter a valid professional email address").max(120);
const optionalUrl = z.string().trim().url("Enter a valid URL").optional().or(z.literal(""));

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(80),
  email: professionalEmail,
  organisation: z.string().trim().min(2, "Company or organisation is required").max(120),
  subject: z.string().trim().min(4, "Subject is required").max(120),
  message: z.string().trim().min(20, "Message must be at least 20 characters").max(2000),
  website: z.string().max(0, "Spam check failed").optional()
});

export const resumeRequestSchema = z.object({
  fullName: z.string().trim().min(2, "Full name is required").max(80),
  email: professionalEmail,
  organisation: z.string().trim().min(2, "Company or organisation is required").max(120),
  jobTitle: z.string().trim().min(2, "Job title is required").max(120),
  reason: z.string().trim().min(20, "Please provide a brief professional reason").max(1600),
  linkedinUrl: optionalUrl,
  consent: z.coerce.boolean().refine(Boolean, "Consent is required"),
  website: z.string().max(0, "Spam check failed").optional()
});

export const projectSchema = z.object({
  title: z.string().trim().min(2).max(120),
  slug: z.string().trim().min(2).max(140),
  shortDescription: z.string().trim().min(10).max(220),
  fullDescription: z.string().trim().min(20).max(4000),
  imageUrl: optionalUrl,
  galleryImages: z.array(z.string().url()).default([]),
  technologies: z.array(z.string().trim().min(1)).min(1),
  githubUrl: optionalUrl,
  liveUrl: optionalUrl,
  status: z.enum(["Completed", "In Progress", "Academic Project", "Personal Project"]),
  type: z.string().trim().min(2).max(80),
  completionDate: z.string().optional(),
  featured: z.coerce.boolean(),
  published: z.coerce.boolean(),
  order: z.coerce.number().int().min(0)
});

export type ContactInput = z.infer<typeof contactSchema>;
export type ResumeRequestInput = z.infer<typeof resumeRequestSchema>;
export type ProjectInput = z.infer<typeof projectSchema>;
