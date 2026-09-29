import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError";

export type AuthUser = {
  id: string;
  email: string;
  role: "USER" | "ADMIN";
};

export type AuthenticatedRequest = Request & {
  user?: AuthUser;
};

function getJwtSecret() {
  const secret = process.env.JWT_ACCESS_SECRET;

  if (!secret) {
    throw ApiError.internal("JWT_ACCESS_SECRET is not configured");
  }

  return secret;
}

export function requireAuth(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
) {
  const authorization = req.header("Authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return next(ApiError.unauthorized("Authentication required"));
  }

  const token = authorization.slice("Bearer ".length).trim();

  if (!token) {
    return next(ApiError.unauthorized("Authentication required"));
  }

  try {
    const payload = jwt.verify(token, getJwtSecret());

    if (
      typeof payload !== "object" ||
      payload === null ||
      typeof payload.id !== "string" ||
      typeof payload.email !== "string" ||
      (payload.role !== "USER" && payload.role !== "ADMIN")
    ) {
      return next(ApiError.unauthorized("Invalid authentication token"));
    }

    req.user = {
      id: payload.id,
      email: payload.email,
      role: payload.role,
    };

    return next();
  } catch {
    return next(ApiError.unauthorized("Invalid or expired authentication token"));
  }
}

export function requireAdmin(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
) {
  if (!req.user) {
    return next(ApiError.unauthorized("Authentication required"));
  }

  if (req.user.role !== "ADMIN") {
    return next(ApiError.forbidden("Admin access required"));
  }

  return next();
}
