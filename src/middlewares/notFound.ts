import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import AppError from "../utils/apiError";

const notFound = (req: Request, _res: Response, next: NextFunction): void => {
  next(
    new AppError(
      `Route ${req.method} ${req.originalUrl} not found`,
      StatusCodes.NOT_FOUND
    )
  );
};

export default notFound;
