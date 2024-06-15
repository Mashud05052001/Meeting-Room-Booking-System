import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserService } from './user.service';

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
  const { accessToken, newData } = await UserService.loginUser(req?.body);
  //   console.log(userOthersData);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User logged in successfully',
    token: accessToken,
    data: newData,
  });
});

export const UserController = {
  signupUser,
  loginUser,
};
