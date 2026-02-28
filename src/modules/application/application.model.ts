import { model, Schema } from "mongoose";
import { APPLICATION_STATUSES, IApplication } from "./application.interface";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const urlRegex = /^(https?:\/\/)[^\s$.?#].[^\s]*$/i;

const applicationSchema = new Schema<IApplication>(
  {
    jobId: {
      type: Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (value: string) => emailRegex.test(value),
        message: "Invalid email format",
      },
    },
    resumeLink: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: (value: string) => urlRegex.test(value),
        message: "Invalid URL format",
      },
    },
    coverNote: {
      type: String,
      maxlength: 1000,
    },
    status: {
      type: String,
      enum: APPLICATION_STATUSES,
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

applicationSchema.index({ jobId: 1, email: 1 }, { unique: true });

const Application = model<IApplication>("Application", applicationSchema);

export default Application;
