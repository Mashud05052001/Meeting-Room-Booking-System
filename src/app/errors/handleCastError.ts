import mongoose from 'mongoose';
import { TErrorSources } from '../interface/error';

const handleCastError = (error: mongoose.Error.CastError) => {
  const statusCode = 400;
  const message = 'Cast Error';
  const errorMessages: TErrorSources = [
    { path: error.path, message: error.message },
  ];
  return {
    statusCode,
    message,
    errorMessages,
  };
};

export default handleCastError;
