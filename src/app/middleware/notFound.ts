import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';

const notFound = async (req: Request, res: Response, _next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    statusCode: 404,
    message: 'Not Found',
  });
};

export default notFound;
