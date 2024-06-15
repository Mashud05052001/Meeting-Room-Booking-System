import { Response } from 'express';
import httpStatus from 'http-status';

type TResponseData<T> = {
  statusCode: number;
  success: boolean;
  message?: string;
  token?: string;
  data: T;
};

const sendResponse = <T>(res: Response, responseData: TResponseData<T>) => {
  const data: Record<string, unknown> = {};
  const token = responseData?.token;
  if (
    !responseData?.data ||
    (Array.isArray(responseData.data) && responseData.data.length === 0)
  ) {
    data.success = false;
    data.statusCode = httpStatus.NOT_FOUND;
    data.message = 'No Data Found';
    data.data = [];
  } else {
    data.success = responseData.success;
    data.statusCode = responseData.statusCode;
    data.message = responseData?.message || 'Work done successfully';
    if (token) data.token = token;
    data.data = responseData?.data;
  }

  res.status(responseData.statusCode).json(data);
};

export default sendResponse;
