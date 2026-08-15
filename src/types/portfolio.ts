export type ProjectStatus = "Completed" | "In Progress" | "Academic Project" | "Personal Project";
export type ResumeRequestStatus = "Pending" | "Approved" | "Rejected" | "Expired";

export interface Timestamped {
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Profile {
  name: string;
  headline: string;
  intro: string;
  biography: string;
  currentStudies: string;
  technicalInterests: string[];
  careerInterests: string[];
  currentLearning: string[];
  professionalGoals: string;
  location: string;
  university: string;
  study: string;
  githubUrl: string;
  linkedinUrl: string;
  profileImageUrl?: string;
  resumeStoragePath?: string;
}

export interface Project extends Timestamped {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  imageUrl?: string;
  galleryImages: string[];
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  status: ProjectStatus;
  type: string;
  completionDate?: string;
  featured: boolean;
  published: boolean;
  order: number;
}

export interface SkillGroup {
  id: string;
  category: string;
  skills: string[];
  order: number;
}

export interface ContactMessage extends Timestamped {
  id?: string;
  name: string;
  email: string;
  organisation: string;
  subject: string;
  message: string;
  read: boolean;
  archived: boolean;
}

export interface ResumeRequest extends Timestamped {
  id?: string;
  fullName: string;
  email: string;
  organisation: string;
  jobTitle: string;
  reason: string;
  linkedinUrl?: string;
  consent: boolean;
  status: ResumeRequestStatus;
  approvedAt?: Date;
  expiresAt?: Date;
  accessTokenId?: string;
}

export interface ResumeAccessToken extends Timestamped {
  id?: string;
  requestId: string;
  tokenHash: string;
  expiresAt: Date;
  revoked: boolean;
  revokedAt?: Date;
}
