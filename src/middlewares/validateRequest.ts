import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ZodTypeAny } from "zod";
import AppError from "../utils/apiError";

const validateRequest = (schema: ZodTypeAny) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const parsed = schema.safeParse(req.body);

    if (!parsed.success) {
      const formattedMessages = parsed.error.issues
        .map((issue) => {
          const field = issue.path.join(".") || "body";
          return `${field}: ${issue.message}`;
        })
        .join(", ");

      throw new AppError(
        `Validation failed: ${formattedMessages}`,
        StatusCodes.BAD_REQUEST
      );
    }

    next();
  };
};

export default validateRequest;
