import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserService } from './user.service';
import { TJwtPayload } from './user.interface';
import config from '../../config';
import { Response } from 'express';

const sendCookies = (res: Response, refreshToken: string) => {
  res.cookie('refreshToken', refreshToken, {
    secure: config.node_env === 'production',
    httpOnly: true,
    sameSite: true,
    maxAge: 1000 * 60 * 60 * 24 * 90, // validity 3 months
  });
};

const getUserInfos = catchAsync(async (req, res) => {
  const data = req?.body;
  const result = await UserService.getUserInfos(data);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User found successfully',
    data: result,
  });
});

const updateUserInfos = catchAsync(async (req, res) => {
  const data = req?.body;
  const result = await UserService.updateUser(data);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User updated successfully',
    data: result,
  });
});

const getAllUsers = catchAsync(async (req, res) => {
  const result = await UserService.getAllUsers();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All users retrived successfully',
    data: result,
  });
});

const updateUserRole = catchAsync(async (req, res) => {
  const result = await UserService.updateUserRole(req?.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User role updated successfully',
    data: result,
  });
});

//! Authentication & Authorization
const signupUser = catchAsync(async (req, res) => {
  const data = req?.body;
  console.log(data);
  const { accessToken, refreshToken, result } =
    await UserService.signupUser(data);
  sendCookies(res, refreshToken);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    token: accessToken,
    message: 'User registered successfully',
    data: result,
  });
});

const loginUser = catchAsync(async (req, res) => {
  const { accessToken, refreshToken, result } = await UserService.loginUser(
    req?.body,
  );
  sendCookies(res, refreshToken);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User logged in successfully',
    token: accessToken,
    data: result,
  });
});

const changePassword = catchAsync(async (req, res) => {
  console.log(req?.user, req?.body);
  const result = await UserService.changePassword(
    req.user as TJwtPayload,
    req.body,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password changed successfully',
    data: result,
  });
});

const generateAccessTokenFromRefreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result =
    await UserService.generateAccessTokenFromRefreshToken(refreshToken);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Access token retrived successfully',
    token: result,
    data: 'null',
  });
});

const forgetPassword = catchAsync(async (req, res) => {
  const result = await UserService.forgetPassword(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Reset email send successfully. Please check your eamil!',
    data: result,
  });
});

const resetPassword = catchAsync(async (req, res) => {
  const token = (req?.headers?.authorization as string)?.split(' ')[1];

  const result = await UserService.resetPassword(token, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password is changed successfully. Please login with new password',
    data: result,
  });
});

const sendContactEmail = catchAsync(async (req, res) => {
  const result = await UserService.sendContactEmail(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Email send successfully',
    data: result,
  });
});

export const UserController = {
  getUserInfos,
  updateUserInfos,
  getAllUsers,
  updateUserRole,
  signupUser,
  loginUser,
  changePassword,
  generateAccessTokenFromRefreshToken,
  forgetPassword,
  resetPassword,
  sendContactEmail,
};
