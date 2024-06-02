import createHttpError, { isHttpError } from "http-errors";
import { NextFunction, Request, Response } from "express";
import { logger } from "../config/logger";

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  next(createHttpError(404, "Endpoint not found"));
};

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(error);

  let statusCode = 500;
  let errorMessage = "Internal server error";

  if (isHttpError(error)) {
    statusCode = error.statusCode;
    errorMessage = error.message;
  }

  res.status(statusCode).json({
    error: {
      message: errorMessage,
    },
  });
};