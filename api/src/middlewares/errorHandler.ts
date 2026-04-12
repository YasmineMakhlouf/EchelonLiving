import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/errors";

interface ErrorResponse {
  success: false;
  message: string;
  requestId: string;
  errors?: unknown;
  stack?: string;
}

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const normalizedError = err as {
    status?: number;
    statusCode?: number;
    message?: string;
    stack?: string;
    details?: unknown;
  };

  const status = normalizedError.status || normalizedError.statusCode || 500;
  const isOperational = err instanceof AppError;
  const message = isOperational
    ? normalizedError.message || "Request failed"
    : status >= 500
      ? "Internal Server Error"
      : normalizedError.message || "Request failed";

  const requestId = (req.headers["x-request-id"] as string) || crypto.randomUUID();

  const response: ErrorResponse = {
    success: false,
    message,
    requestId,
  };

  if (isOperational && normalizedError.details) {
    response.errors = normalizedError.details;
  }

  if (process.env.NODE_ENV === "development") {
    response.stack = normalizedError.stack;
  }

  res.status(status).json(response);
};

export default errorHandler;
