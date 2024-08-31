import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserService } from './user.service';
import { TJwtPayload } from './user.interface';
import config from '../../config';

const signupUser = catchAsync(async (req, res) => {
  const data = req?.body;
  const result = await UserService.signupUser(data);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User registered successfully',
    data: result,
  });
});

const loginUser = catchAsync(async (req, res) => {
  const { accessToken, refreshToken, user } = await UserService.loginUser(
    req?.body,
  );
  res.cookie('refreshToken', refreshToken, {
    secure: config.node_env === 'production',
    httpOnly: true,
    sameSite: true,
    maxAge: 1000 * 60 * 60 * 24 * 90, // validity 3 months
  });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User logged in successfully',
    token: accessToken,
    data: user,
  });
});

const changePassword = catchAsync(async (req, res) => {
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

export const UserController = {
  signupUser,
  loginUser,
  changePassword,
  generateAccessTokenFromRefreshToken,
  forgetPassword,
  resetPassword,
};
