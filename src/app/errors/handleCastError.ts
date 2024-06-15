import mongoose from 'mongoose';
import { TErrorMessages } from '../interface/error';

const handleCastError = (error: mongoose.Error.CastError) => {
  const statusCode = 400;
  const message = 'Cast Error';
  const errorMessages: TErrorMessages = [
    { path: error.path, message: error.message },
  ];
  return {
    statusCode,
    message,
    errorMessages,
  };
};

export default handleCastError;
