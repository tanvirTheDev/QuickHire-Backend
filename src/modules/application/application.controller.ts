import { Request } from "express";
import { StatusCodes } from "http-status-codes";
import sendResponse from "../../utils/apiResponse";
import catchAsync from "../../utils/catchAsync";
import {
  getAllApplications,
  getApplicationById,
  getApplicationsByJobId,
  submitApplication,
} from "./application.service";

const getParam = (req: Request, key: "id" | "jobId"): string => {
  const value = req.params[key];
  return Array.isArray(value) ? value[0] : value;
};

export const submitApplicationController = catchAsync(async (req, res) => {
  const application = await submitApplication(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Application submitted successfully",
    data: application,
  });
});

export const getAllApplicationsController = catchAsync(async (_req, res) => {
  const applications = await getAllApplications();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Applications retrieved successfully",
    data: applications,
  });
});

export const getApplicationByIdController = catchAsync(async (req, res) => {
  const application = await getApplicationById(getParam(req, "id"));

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Application retrieved successfully",
    data: application,
  });
});

export const getApplicationsByJobIdController = catchAsync(async (req, res) => {
  const applications = await getApplicationsByJobId(getParam(req, "jobId"));

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Applications for job retrieved successfully",
    data: applications,
  });
});
