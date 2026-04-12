import { NextFunction, Request, Response } from "express";
import { RequestWithUser } from "./authMiddleware";
import type { UserRole } from "../types/user";
import { ForbiddenError, UnauthorizedError } from "../utils/errors";

export const requireRoles = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as RequestWithUser).user;

    if (!user) {
      next(new UnauthorizedError("Authentication required"));
      return;
    }

    if (!roles.includes(user.role)) {
      next(new ForbiddenError("You do not have permission to perform this action"));
      return;
    }

    next();
  };
};

export const requireAdmin = requireRoles("admin");
