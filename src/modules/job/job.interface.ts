import { Document } from "mongoose";

export const JOB_CATEGORIES = [
  "Engineering",
  "Design",
  "Marketing",
  "Sales",
  "Finance",
  "HR",
  "Operations",
  "Other",
] as const;

export const JOB_TYPES = [
  "Full-time",
  "Part-time",
  "Remote",
  "Contract",
  "Internship",
] as const;

export type JobCategory = (typeof JOB_CATEGORIES)[number];
export type JobType = (typeof JOB_TYPES)[number];

export interface IJob extends Document {
  title: string;
  company: string;
  location: string;
  category: JobCategory;
  type: JobType;
  salary?: string;
  description: string;
  requirements?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateJobInput {
  title: string;
  company: string;
  location: string;
  category: JobCategory;
  type: JobType;
  salary?: string;
  description: string;
  requirements?: string;
}

export type IUpdateJobInput = Partial<ICreateJobInput>;

export interface IJobQuery {
  search?: string;
  category?: string;
  location?: string;
  type?: string;
  page?: string;
  limit?: string;
}
