import mongoose from 'mongoose';
import { TErrorMessages } from '../interface/error';

const handleDuplicateError = (error: { message: string }) => {
  const message = 'Duplicate Entry',
    statusCode = 400;
  const extracted_msg = error?.message.match(/dup key: { name: "(.*?)" }/);
  const extractedMessage = extracted_msg ? extracted_msg[1] : null;

  const errorMessages: TErrorMessages = [
    {
      path: '',
      message: `${extractedMessage} is already exist`,
    },
  ];

  return {
    statusCode,
    message,
    errorMessages,
  };
};

export default handleDuplicateError;
