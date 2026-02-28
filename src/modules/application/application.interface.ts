import { Document, Types } from "mongoose";

export const APPLICATION_STATUSES = ["pending", "reviewed", "rejected"] as const;
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export interface IApplication extends Document {
  jobId: Types.ObjectId;
  name: string;
  email: string;
  resumeLink: string;
  coverNote?: string;
  status: ApplicationStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateApplicationInput {
  jobId: string;
  name: string;
  email: string;
  resumeLink: string;
  coverNote?: string;
}
