export enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
}

export enum ApplicationStatus {
  PENDING = "PENDING",
  REVIEWED = "REVIEWED",
  INTERVIEWED = "INTERVIEWED",
  OFFERED = "OFFERED",
  REJECTED = "REJECTED",
}

export interface User {
  id: string;
  name?: string;
  email: string;
  emailVerified?: Date;
  image?: string;
  hashedPassword?: string;
  createdAt: Date;
  updatedAt: Date;
  role: Role;
  accounts: Account[];
  sessions: Session[];
  savedJobs: SavedJob[];
  applications: JobApplication[];
}

export interface Account {
  id: string;
  userId: string;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token?: string;
  access_token?: string;
  expires_at?: number;
  token_type?: string;
  scope?: string;
  id_token?: string;
  session_state?: string;
  user: User;
}

export interface Session {
  id: string;
  sessionToken: string;
  userId: string;
  expires: Date;
  user: User;
}

export interface VerificationToken {
  identifier: string;
  token: string;
  expires: Date;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  salary?: string;
  jobType: string;
  postedAt: Date;
  url: string;
  savedBy: SavedJob[];
  applications: JobApplication[];
}

export interface SavedJob {
  id: string;
  userId: string;
  jobId: string;
  savedAt: Date;
  user: User;
  job: Job;
}

export interface JobApplication {
  id: string;
  userId: string;
  jobId: string;
  appliedAt: Date;
  status: ApplicationStatus;
  user: User;
  job: Job;
}
