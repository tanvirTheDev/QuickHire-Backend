import { StatusCodes } from "http-status-codes";
import { Request } from "express";
import sendResponse from "../../utils/apiResponse";
import catchAsync from "../../utils/catchAsync";
import { IJobQuery } from "./job.interface";
import {
  createJob,
  deleteJob,
  getAllJobs,
  getJobById,
  updateJob,
} from "./job.service";

const parseJobQuery = (req: Request): IJobQuery => {
  return {
    search: typeof req.query.search === "string" ? req.query.search : undefined,
    category:
      typeof req.query.category === "string" ? req.query.category : undefined,
    location:
      typeof req.query.location === "string" ? req.query.location : undefined,
    type: typeof req.query.type === "string" ? req.query.type : undefined,
    page: typeof req.query.page === "string" ? req.query.page : undefined,
    limit: typeof req.query.limit === "string" ? req.query.limit : undefined,
  };
};

const getIdParam = (req: Request): string => {
  return Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
};

export const getAllJobsController = catchAsync(async (req, res) => {
  const query = parseJobQuery(req);
  const result = await getAllJobs(query);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Jobs retrieved successfully",
    data: result.jobs,
    meta: result.meta,
  });
});

export const getJobByIdController = catchAsync(async (req, res) => {
  const job = await getJobById(getIdParam(req));

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Job retrieved successfully",
    data: job,
  });
});

export const createJobController = catchAsync(async (req, res) => {
  const job = await createJob(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Job created successfully",
    data: job,
  });
});

export const updateJobController = catchAsync(async (req, res) => {
  const job = await updateJob(getIdParam(req), req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Job updated successfully",
    data: job,
  });
});

export const deleteJobController = catchAsync(async (req, res) => {
  const result = await deleteJob(getIdParam(req));

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: result.message,
  });
});
