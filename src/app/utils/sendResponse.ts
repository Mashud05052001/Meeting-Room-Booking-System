import { Response } from 'express';

type TResponseData<T> = {
  statusCode: number;
  success: boolean;
  message?: string;
  token?: string;
  data: T;
};

const sendResponse = <T>(res: Response, responseData: TResponseData<T>) => {
  const data: Record<string, unknown> = {
    success: responseData.success,
    statusCode: responseData.statusCode,
    message: responseData?.message || 'Work done successfully',
  };
  const token = responseData?.token;
  if (token) data.token = token;
  data.data = responseData?.data;

  res.status(responseData.statusCode).json(data);
};

export default sendResponse;
