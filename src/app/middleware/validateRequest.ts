import { NextFunction, Request, Response } from 'express';
import { AnyZodObject } from 'zod';
import { catchAsync } from '../utils/catchAsync';

export const validateRequest = (schema: AnyZodObject) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const data = {
      body: req?.body,
      cookies: req?.cookies,
    };
    const parsedResult = await schema.parseAsync(data);
    req.body = parsedResult.body;
    next();
  });
};
