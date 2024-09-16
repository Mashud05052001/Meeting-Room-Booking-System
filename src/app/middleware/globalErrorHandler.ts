/* eslint-disable @typescript-eslint/no-unused-vars */
import { ErrorRequestHandler } from 'express';
import { TErrorSources } from '../interface/error';
import config from '../config';
import { ZodError } from 'zod';
import handleZodError from '../errors/handleZodError';
import handleValidationError from '../errors/handleValidationError';
import handleCastError from '../errors/handleCastError';
import handleDuplicateError from '../errors/handleDuplicateError';
import AppError from '../errors/AppError';
import httpStatus from 'http-status';

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let statusCode = 500,
    message = `Something went wrong!`,
    errorSources: TErrorSources = [
      {
        path: '',
        message: `Something went wrong!`,
      },
    ];
  const getModifiedError = () => {
    if (err instanceof ZodError) return handleZodError(err);
    else if (err?.name === 'ValidationError') return handleValidationError(err);
    else if (err?.name === 'CastError') return handleCastError(err);
    else if (err.code === 11000) return handleDuplicateError(err);
    return null;
  };
  const modifiedError = getModifiedError();

  if (modifiedError) {
    statusCode = modifiedError.statusCode;
    message = modifiedError.message;
    errorSources = modifiedError.errorMessages;
  } else if (err instanceof AppError) {
    statusCode = err?.statusCode;
    message = err?.message;
    errorSources = [{ path: '', message: err.message }];
  } else if (err instanceof Error) {
    message = err?.message;
    errorSources = [{ path: '', message: err.message }];
  }

  // if (err?.statusCode === httpStatus.UNAUTHORIZED) {
  //   res.status(err?.statusCode).json({
  //     success: false,
  //     statusCode: err?.statusCode,
  //     message: 'Unauthorized access',
  //   });
  // } else {
  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    stack: config.node_env === 'development' ? err?.stack : null,
  });
  // }
};

export default globalErrorHandler;
