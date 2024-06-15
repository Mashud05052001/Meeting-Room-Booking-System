import { ErrorRequestHandler } from 'express';
import { TErrorMessages } from '../interface/error';
import config from '../config';
import { ZodError } from 'zod';
import handleZodError from '../errors/handleZodError';
import handleValidationError from '../errors/handleValidationError';
import handleCastError from '../errors/handleCastError';
import handleDuplicateError from '../errors/handleDuplicateError';
import AppError from '../errors/AppError';

const globalErrorHandler: ErrorRequestHandler = (err, _req, res, next) => {
  let statusCode = 500,
    message = `Something went wrong!`,
    errorMessages: TErrorMessages = [
      {
        path: '',
        message: `Something went wrong!`,
      },
    ];
  if (err instanceof ZodError) {
    const simplifyErr = handleZodError(err);
    statusCode = simplifyErr.statusCode;
    message = simplifyErr.message;
    errorMessages = simplifyErr.errorMessages;
  } else if (err?.name === 'ValidationError') {
    const simplifyErr = handleValidationError(err);
    statusCode = simplifyErr.statusCode;
    message = simplifyErr.message;
    errorMessages = simplifyErr.errorMessages;
  } else if (err?.name === 'CastError') {
    const simplifyErr = handleCastError(err);
    statusCode = simplifyErr.statusCode;
    message = simplifyErr.message;
    errorMessages = simplifyErr.errorMessages;
  } else if (err.code === 11000) {
    const simplifiedError = handleDuplicateError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorMessages = simplifiedError?.errorMessages;
  } else if (err instanceof AppError) {
    statusCode = err?.statusCode;
    message = err?.message;
    errorMessages = [{ path: '', message: err.message }];
  } else if (err instanceof Error) {
    message = err?.message;
    errorMessages = [{ path: '', message: err.message }];
  }

  if (err?.statusCode === 401) {
    res.status(err?.statusCode).json({
      success: false,
      statusCode: err?.statusCode,
      message: 'You have no access to this route',
    });
  } else {
    res.status(statusCode).json({
      success: false,
      message,
      errorMessages,
      stack: config.node_env === 'development' ? err?.stack : null,
    });
  }
};

export default globalErrorHandler;
