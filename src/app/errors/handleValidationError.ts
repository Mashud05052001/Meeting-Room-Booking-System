import httpStatus from 'http-status';
import mongoose from 'mongoose';
import { TErrorSources } from '../interface/error';

const handleValidationError = (error: mongoose.Error.ValidationError) => {
  const statusCode = httpStatus.BAD_REQUEST;
  const message = 'Validation Error';
  const errorMessages: TErrorSources = Object.values(error.errors).map(
    (error) => {
      return {
        message: error.message,
        path: error.path,
      };
    },
  );
  return {
    statusCode,
    message,
    errorMessages,
  };
};

export default handleValidationError;
