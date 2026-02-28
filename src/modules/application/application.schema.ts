import mongoose from "mongoose";
import { z } from "zod";

export const createApplicationSchema = z.object({
  jobId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid job ID",
  }),
  name: z.string().min(2).max(100),
  email: z.string().email(),
  resumeLink: z.string().url(),
  coverNote: z.string().max(1000).optional(),
});
