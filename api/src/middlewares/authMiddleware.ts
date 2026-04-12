import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import type { UserRole } from "../types/user";
import { env } from "../config/env";
import { UnauthorizedError } from "../utils/errors";

interface AuthTokenPayload extends JwtPayload {
  id: number;
  role: UserRole;
}

export type RequestWithUser = Request & { user?: AuthTokenPayload };

const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.header("Authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : undefined;

  if (!token) {
    next(new UnauthorizedError("Missing or invalid authorization token"));
    return;
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as AuthTokenPayload;
    (req as RequestWithUser).user = decoded;
    next();
  } catch (_error) {
    next(new UnauthorizedError("Invalid or expired token"));
  }
};

export default authMiddleware;
