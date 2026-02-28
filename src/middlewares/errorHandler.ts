import { ErrorRequestHandler } from "express";
import mongoose from "mongoose";
import { StatusCodes } from "http-status-codes";
import { ZodError } from "zod";
import AppError from "../utils/apiError";

type DuplicateKeyError = {
  code?: number;
  keyPattern?: Record<string, unknown>;
};

const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  let message =
    process.env.NODE_ENV === "development"
      ? error.message || "Something went wrong"
      : "Something went wrong";
  let errors: Array<{ field: string; message: string }> | undefined;

  if (error instanceof mongoose.Error.ValidationError) {
    statusCode = StatusCodes.BAD_REQUEST;
    const messages = Object.values(error.errors).map((err) => err.message);
    message = messages.join(", ");
    errors = Object.values(error.errors).map((err) => ({
      field: err.path,
      message: err.message,
    }));
  } else if (error instanceof mongoose.Error.CastError) {
    statusCode = StatusCodes.BAD_REQUEST;
    message = `Invalid ${error.path}: ${error.value}`;
  } else if ((error as DuplicateKeyError).code === 11000) {
    statusCode = StatusCodes.CONFLICT;
    const keyField =
      Object.keys((error as DuplicateKeyError).keyPattern || {})[0] ||
      "unknown";
    message = `Duplicate value for field: ${keyField}`;
  } else if (error instanceof ZodError) {
    statusCode = StatusCodes.BAD_REQUEST;
    message = "Validation failed";
    errors = error.issues.map((issue) => ({
      field: issue.path.join(".") || "body",
      message: issue.message,
    }));
  } else if (error instanceof AppError && error.isOperational) {
    statusCode = error.statusCode;
    message = error.message;
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    ...(errors ? { errors } : {}),
    ...(statusCode === StatusCodes.INTERNAL_SERVER_ERROR &&
    process.env.NODE_ENV === "development"
      ? { stack: error.stack }
      : {}),
  });
};

export default errorHandler;
