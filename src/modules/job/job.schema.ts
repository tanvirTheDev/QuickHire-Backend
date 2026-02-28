import { z } from "zod";
import { JOB_CATEGORIES, JOB_TYPES } from "./job.interface";

export const createJobSchema = z.object({
  title: z.string().min(3).max(100),
  company: z.string().min(2).max(100),
  location: z.string().min(2),
  category: z.enum(JOB_CATEGORIES),
  type: z.enum(JOB_TYPES),
  salary: z.string().optional(),
  description: z.string().min(20),
  requirements: z.string().optional(),
});

export const updateJobSchema = createJobSchema.partial();
