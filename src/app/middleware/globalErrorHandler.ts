import { ErrorRequestHandler } from 'express';
import { TErrorSources } from '../interface/error';
import config from '../config';

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let statusCode = 500,
    message = `Something went wrong!`,
    errorSources: TErrorSources = [
      {
        path: '',
        message: `Something went wrong!`,
      },
    ];

  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    stack: config.node_env === 'development' ? err?.stack : null,
  });
};

export default globalErrorHandler;
