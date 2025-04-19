import { NextFunction, Request, Response, RequestHandler } from 'express';
import { ZodSchema, ZodError } from 'zod';

export function validateDto<T>(schema: ZodSchema<T>): RequestHandler {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const result = schema.parse(req.body);
      req.body = result;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const customErrors = error.errors.map(err => {
          if (err.code === "invalid_type" && err.path.length > 0) {
            return {
              field: err.path.join('.'),
              message: `The field '${err.path.join('.')}' is missing or invalid.`
            };
          }
          return {
            field: err.path.join('.'),
            message: err.message
          };
        });

        res.status(400).json({
          message: "Validation error: one or more fields do not follow the expected schema. Verify if the request body is correct.",
          errors: customErrors
        });
      } else {
        next(error);
      }
    }
  };
}