import { ZodError, ZodIssue } from 'zod';
import { TErrorMessages } from '../interface/error';
import httpStatus from 'http-status';

const handleZodError = (error: ZodError) => {
  const statusCode = httpStatus.BAD_REQUEST;
  const message = 'Validation Error';
  const errorMessages: TErrorMessages = error.issues.map((issue: ZodIssue) => {
    return {
      path: issue?.path[issue.path.length - 1].toString(),
      message: issue?.message.toString(),
    };
  });

  return {
    statusCode,
    message,
    errorMessages,
  };
};

export default handleZodError;
