import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { ZodError } from "zod";
import { ApiError } from "../utils/ApiError.js";
import { env } from "../config/env.js";

interface MongoDuplicateKeyError extends Error {
  code: number;
  keyValue?: Record<string, unknown>;
}

export const errorHandler = (
  err: Error | ApiError | ZodError | mongoose.Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  let statusCode = 500;
  let message = "Internal Server Error";
  let errors: Array<{ field?: string; message: string }> | undefined = undefined;

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors;
  } else if (err instanceof ZodError) {
    statusCode = 400;
    message = "Validation failed";
    errors = err.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));
  } else if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = `Invalid format for field: ${err.path}`;
    errors = [{ field: err.path, message: `Invalid ID: ${err.value}` }];
  } else if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = "Validation failed";
    errors = Object.values(err.errors).map((item) => ({
      field: item.path,
      message: item.message,
    }));
  } else if ("code" in err && (err as MongoDuplicateKeyError).code === 11000) {
    statusCode = 409;
    const dupKey = (err as MongoDuplicateKeyError).keyValue;
    const field = dupKey ? Object.keys(dupKey)[0] : "field";
    message = `Duplicate value entered for ${field}`;
    errors = [{ field, message: `${field} already exists` }];
  } else {
    // Unhandled exception
    message = err.message || "An unexpected error occurred";
  }

  // Log server errors in non-test environment
  if (statusCode >= 500 && env.NODE_ENV !== "test") {
    console.error("Unhandled Error:", err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(errors && errors.length > 0 ? { errors } : {}),
    ...(env.NODE_ENV === "development" ? { stack: err.stack } : {}),
  });
};
