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
import { generateResetEmail } from './user.constant';

// Get User Information
const getUserInfos = async (payload: Pick<TUser, 'email'>) => {
  const user = await User.findOne({ email: payload.email }).select(
    '-createdAt -updatedAt -changePasswordAt -__v',
  );
  if (!user) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'This email is not found. Please register first!',
    );
  }
  return user;
};

const updateUser = async (payload: Partial<TUser> & Pick<TUser, 'email'>) => {
  const result = await User.findOneAndUpdate(
    { email: payload.email },
    payload,
    { new: true },
  );
  return result;
};

const getAllUsers = async () => {
  const roleOrder = {
    'super-admin': 1,
    admin: 2,
    user: 3,
  };
  const users = await User.find();
  users.sort((a, b) => roleOrder[a.role] - roleOrder[b.role]);
  return users;
};

const updateUserRole = async (payload: Pick<TUser, 'email' | 'role'>) => {
  const result = await User.findOneAndUpdate(
    { email: payload.email },
    { role: payload.role },
    { new: true },
  );
  return result;
};

//! Authentication & Authorization
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

  await User.create(payload);
  const jwtPayload = {
    email: payload.email,
    role: payload.role,
  };
  const accessToken = createJwtAccessToken(jwtPayload);
  const refreshToken = createJwtRefreshToken(jwtPayload);

  return { accessToken, refreshToken, result: 'User created successfully' };
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

  return { accessToken, refreshToken, result: 'User Found' };
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

  await User.findOneAndUpdate(
    { email: jwtUser?.email },
    { password: hashedNewPassword, changePasswordAt: new Date() },
    { new: true },
  );

  return 'Password changed successfully';
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
  });
  if (!user) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'This email is not registered yet. Please signup.',
    );
  }
  const jwtPayload = {
    email: user.email,
    role: user?.role,
  };
  const shortTimeAccessToken = createJwtAccessToken(jwtPayload, '10m');
  const resetURL = `${config.reset_password_url}?email=${payload?.email}&token=${shortTimeAccessToken}`;
  // generate a mail using nodemailer & send this
  const html = generateResetEmail(user?.name, resetURL);
  await sendEmail(user.email, html, 'high');
  return 'Reset password email send successfull';
  // return resetURL;
};

/* Reset-Password
1. Check the short time token existancy.
2. Check the token decoded email & user provided email is same or not
3. Check the difference token iat & exp time is 10min (your provided short time) or not
4. Check user existancy
5. Check user password is as same as before or not
6. Check user is changed password more than 1 time or not using this url. For this you have to update change password time while first time updating & after then you can compare resetPasswordTime with token initial time
7. Generate a new hashed password update the password & update the reset password time
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
  if ((decodedTokenData.exp! - decodedTokenData.iat!) / 60 !== 10) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'Token not matched. Please again try for password resetting',
    );
  }

  const user = await User.findUser(payload.email, true);
  if (!user) {
    throw new AppError(httpStatus.FORBIDDEN, 'This email is not found.');
  }

  if (await User.isPasswordValid(payload.password, user?.password)) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "That's your previous password. Please generate a new one or login.",
    );
  }

  if (
    user?.changePasswordAt &&
    User.isJwtIssueBeforePasswordChange(
      decodedTokenData.iat!,
      user?.changePasswordAt,
    )
  ) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'You cannot change password more than 1 time using same url.',
    );
  }

  const hashedNewPassword = await createHashedPassword(payload.password);
  await User.findOneAndUpdate(
    { email: payload.email },
    {
      password: hashedNewPassword,
      changePasswordAt: new Date(),
    },
  );
  return 'Password reset successful';
};

export const UserService = {
  getUserInfos,
  updateUser,
  getAllUsers,
  updateUserRole,
  signupUser,
  loginUser,
  changePassword,
  generateAccessTokenFromRefreshToken,
  forgetPassword,
  resetPassword,
};
