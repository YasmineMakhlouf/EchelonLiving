import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { ValidationError } from "../utils/errors";

const validateRequest = (req: Request, res: Response, next: NextFunction): void => {
  const validationErrors = validationResult(req);

  if (validationErrors.isEmpty()) {
    next();
    return;
  }

  const errors: Record<string, string> = {};

  for (const error of validationErrors.array()) {
    if ("path" in error && typeof error.path === "string") {
      errors[error.path] = error.msg;
    }
  }

  next(new ValidationError("Validation failed", errors));
};

export default validateRequest;
