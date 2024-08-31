import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import {
  TChangePassword,
  TJwtPayload,
  TForgetPassword,
  TUser,
  TResetPassword,
} from './user.interface';
import { User } from './user.model';
import {
  createHashedPassword,
  createJwtAccessToken,
  createJwtRefreshToken,
  verifyAccessToken,
  verifyRefrestToken,
} from './user.utils';
import config from '../../config';
import sendEmail from '../../utils/sendEmail';
import { generateForgetEmail } from './user.constant';

/* SignUp
1. Check the user is already exist or not
2. bcrypt the password before save
3. delete the password field from response data
*/
const signupUser = async (payload: TUser) => {
  const user = await User.findUser(payload.email, false);
  if (user) {
    throw new AppError(
      httpStatus.CONFLICT,
      'This email already have an account in our system. Try to login!',
    );
  }

  const result = await User.create(payload);
  return result;
};

/* Login
1. Check the user is exist or not
2. Check the password is matched or not, with the original one
3. Create jwt access token
*/
const loginUser = async (payload: Pick<TUser, 'email' | 'password'>) => {
  const user = await User.findUser(payload.email, true);
  if (!user) {
    throw new AppError(
      httpStatus.CONFLICT,
      'This email is not found. Please register first!',
    );
  }

  if (
    payload?.password &&
    !(await User.isPasswordValid(payload.password, user.password))
  ) {
    throw new AppError(httpStatus.FORBIDDEN, 'Incorrect Password');
  }

  const jwtPayload = {
    email: user.email,
    role: user?.role,
  };
  const accessToken = createJwtAccessToken(jwtPayload);
  const refreshToken = createJwtRefreshToken(jwtPayload);

  return { accessToken, refreshToken, user };
};

/* Change-Password
1. Check the user is exist or not
2. Check the password is matched or not, with the original one
3. Create the new hashed password & update it
*/
const changePassword = async (
  jwtUser: TJwtPayload,
  payload: TChangePassword,
) => {
  const user = await User.findUser(jwtUser.email, true);
  if (!user) {
    throw new AppError(
      httpStatus.CONFLICT,
      'This email is not found. Please signup first!',
    );
  }

  if (
    payload?.oldPassword &&
    user?.password &&
    !(await User.isPasswordValid(payload.oldPassword, user.password))
  ) {
    throw new AppError(httpStatus.FORBIDDEN, 'Incorrect old password');
  }
  const hashedNewPassword = await createHashedPassword(payload?.newPassword);

  const result = await User.findOneAndUpdate(
    { email: jwtUser?.email },
    { password: hashedNewPassword, changePasswordAt: new Date() },
    { new: true },
  );

  return result;
};

/* Generate-Access-Token
1. Validate the refresh token & find the decoded data.
2. From decoded userId check the user existancy
3. Check the token is before updating the password or not.
4. Create a access token & send it to client side
*/
const generateAccessTokenFromRefreshToken = async (refreshToken: string) => {
  const decodedData = verifyRefrestToken(refreshToken);
  const user = await User.findOne({ email: decodedData.email });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }
  if (
    user?.changePasswordAt &&
    User.isJwtIssueBeforePasswordChange(
      decodedData.iat as number,
      user?.changePasswordAt,
    )
  ) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'Authorization Failed due to user changed the password. Needs updated token!',
    );
  }
  const jwtPayload = {
    email: user?.email,
    role: user?.role,
  };
  const accessToken = createJwtAccessToken(jwtPayload);

  return accessToken;
};

/* Forget-Password
1. Check user existancy
2. Generate a short time token
3. Create an url according to frontend
4. Generate an html for email & send it with the url_link to the user email
*/
const forgetPassword = async (payload: TForgetPassword) => {
  const user = await User.findOne({
    email: payload.email,
    phone: payload.phone,
  });
  if (!user) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'User is not found in out database. Please provide correct values',
    );
  }
  const jwtPayload = {
    email: user.email,
    role: user?.role,
  };
  const shortTimeAccessToken = createJwtAccessToken(jwtPayload, '10m');
  const resetURL = `${config.reset_password_url}?email=${payload?.email}&token=${shortTimeAccessToken}`; // new frontend path
  // generate a mail using nodemailer & send this
  const html = generateForgetEmail(user?.name, resetURL);
  await sendEmail(user.email, html, 'high');
  return 'Reset password email send successfull';
};

/* Reset-Password
1. Check the short time token existancy.
2. Check the token decoded email & user provided email is same or not
3. Check user existancy
4. Generate a new hashed password update the password
*/
const resetPassword = async (token: string, payload: TResetPassword) => {
  if (!token) {
    throw new AppError(httpStatus.FORBIDDEN, 'Reset password token is missing');
  }
  const decodedTokenData = verifyAccessToken(token);
  if (decodedTokenData?.email !== payload?.email) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'Token email & provided user email is not matched',
    );
  }
  const user = await User.findOne({ email: payload.email });
  if (!user) {
    throw new AppError(httpStatus.CONFLICT, 'This email is not found.');
  }
  const hashedNewPassword = await createHashedPassword(payload.password);
  await User.findOneAndUpdate(
    { email: payload.email },
    { password: hashedNewPassword, changePasswordAt: new Date() },
  );
  return 'Password reset successful';
};

export const UserService = {
  signupUser,
  loginUser,
  changePassword,
  generateAccessTokenFromRefreshToken,
  forgetPassword,
  resetPassword,
};
