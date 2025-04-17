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
              message: `O campo '${err.path.join('.')}' está ausente ou inválido.`
            };
          }
          return {
            field: err.path.join('.'),
            message: err.message
          };
        });

        res.status(400).json({
          message: "Erro de validação: um ou mais campos não seguem o schema esperado. Verifique se o corpo da requisição está correto.",
          errors: customErrors
        });
      } else {
        next(error);
      }
    }
  };
}