import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";
import { ApiError } from "../utils/ApiError.js";

interface RequestValidators {
  body?: AnyZodObject;
  query?: AnyZodObject;
  params?: AnyZodObject;
}

export const validate = (validators: RequestValidators) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (validators.params) {
        req.params = (await validators.params.parseAsync(req.params)) as typeof req.params;
      }
      if (validators.query) {
        req.query = (await validators.query.parseAsync(req.query)) as typeof req.query;
      }
      if (validators.body) {
        req.body = await validators.body.parseAsync(req.body);
      }
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const errorDetails = err.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        }));
        return next(ApiError.badRequest("Validation failed", errorDetails));
      }
      next(err);
    }
  };
};
