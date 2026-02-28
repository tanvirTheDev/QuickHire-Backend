import mongoose from "mongoose";
import { StatusCodes } from "http-status-codes";
import AppError from "../../utils/apiError";
import Job from "../job/job.model";
import { ICreateApplicationInput } from "./application.interface";
import Application from "./application.model";

const validateObjectId = (id: string, label: string): void => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(`Invalid ${label}`, StatusCodes.BAD_REQUEST);
  }
};

export const submitApplication = async (payload: ICreateApplicationInput) => {
  const { jobId, email } = payload;

  validateObjectId(jobId, "job id");

  const job = await Job.findOne({ _id: jobId, isActive: true });

  if (!job) {
    throw new AppError(
      "Job not found or no longer active",
      StatusCodes.NOT_FOUND
    );
  }

  const existingApplication = await Application.findOne({
    jobId,
    email: email.toLowerCase(),
  });

  if (existingApplication) {
    throw new AppError(
      "You have already applied to this job",
      StatusCodes.CONFLICT
    );
  }

  const application = await Application.create({
    ...payload,
    email: email.toLowerCase(),
  });

  return application;
};

export const getAllApplications = async () => {
  const applications = await Application.find()
    .sort({ createdAt: -1 })
    .populate("jobId", "title company location")
    .lean();

  return applications;
};

export const getApplicationById = async (id: string) => {
  validateObjectId(id, "application id");

  const application = await Application.findById(id).populate("jobId").lean();

  if (!application) {
    throw new AppError("Application not found", StatusCodes.NOT_FOUND);
  }

  return application;
};

export const getApplicationsByJobId = async (jobId: string) => {
  validateObjectId(jobId, "job id");

  const applications = await Application.find({ jobId })
    .sort({ createdAt: -1 })
    .lean();

  return applications;
};
