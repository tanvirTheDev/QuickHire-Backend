import mongoose from "mongoose";
import { StatusCodes } from "http-status-codes";
import AppError from "../../utils/apiError";
import {
  ICreateJobInput,
  IJob,
  IJobQuery,
  IUpdateJobInput,
} from "./job.interface";
import Job from "./job.model";

const validateObjectId = (id: string): void => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid job id", StatusCodes.BAD_REQUEST);
  }
};

export const getAllJobs = async (query: IJobQuery) => {
  const filter: Record<string, unknown> = {
    isActive: true,
  };

  if (query.search) {
    filter.$text = { $search: query.search };
  }

  if (query.category) {
    filter.category = query.category;
  }

  if (query.location) {
    filter.location = { $regex: query.location, $options: "i" };
  }

  if (query.type) {
    filter.type = query.type;
  }

  const page = Number.parseInt(query.page || "", 10) || 1;
  const limit = Number.parseInt(query.limit || "", 10) || 10;
  const skip = (page - 1) * limit;

  const [jobs, total] = await Promise.all([
    Job.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Job.countDocuments(filter),
  ]);

  return {
    jobs,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getJobById = async (id: string) => {
  validateObjectId(id);

  const job = await Job.findOne({ _id: id, isActive: true }).lean();

  if (!job) {
    throw new AppError("Job not found", StatusCodes.NOT_FOUND);
  }

  return job;
};

export const createJob = async (payload: ICreateJobInput) => {
  const createdJob = await Job.create(payload);
  return createdJob;
};

export const updateJob = async (id: string, payload: IUpdateJobInput) => {
  validateObjectId(id);

  const existingJob = await Job.findOne({ _id: id, isActive: true });

  if (!existingJob) {
    throw new AppError("Job not found", StatusCodes.NOT_FOUND);
  }

  const updatedJob = await Job.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return updatedJob;
};

export const deleteJob = async (id: string) => {
  validateObjectId(id);

  const existingJob = await Job.findOne({ _id: id, isActive: true });

  if (!existingJob) {
    throw new AppError("Job not found", StatusCodes.NOT_FOUND);
  }

  existingJob.isActive = false;
  await existingJob.save();

  return { message: "Job deleted successfully" };
};
