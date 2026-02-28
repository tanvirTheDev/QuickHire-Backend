import { model, Schema } from "mongoose";
import { IJob, JOB_CATEGORIES, JOB_TYPES } from "./job.interface";

const jobSchema = new Schema<IJob>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: JOB_CATEGORIES,
    },
    type: {
      type: String,
      required: true,
      enum: JOB_TYPES,
    },
    salary: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      minlength: 20,
    },
    requirements: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

jobSchema.index({ title: "text", company: "text", description: "text" });
jobSchema.index({ category: 1 });
jobSchema.index({ location: 1 });
jobSchema.index({ isActive: 1 });

const Job = model<IJob>("Job", jobSchema);

export default Job;
