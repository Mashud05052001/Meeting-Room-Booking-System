import httpStatus from 'http-status';
import mongoose from 'mongoose';
import { TErrorMessages } from '../interface/error';

const handleValidationError = (error: mongoose.Error.ValidationError) => {
  const statusCode = httpStatus.BAD_REQUEST;
  const message = 'Validation Error';
  const errorMessages: TErrorMessages = Object.values(error.errors).map(
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
