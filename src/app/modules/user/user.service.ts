import httpStatus from 'http-status';
import AppError from '../../errors/ArrError';
import { TUser } from './user.interface';
import { User } from './user.model';
import jwt from 'jsonwebtoken';
import { createJwtToken } from './user.utils';
import config from '../../config';

/*
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

/*
1. Check the user is exist or not
2. Check the password is matched or not with original one
3. Create jwt access token
*/
const loginUser = async (payload: Pick<TUser, 'email' | 'password'>) => {
  const user = await User.findUser(payload.email, true);
  if (!user) {
    throw new AppError(
      httpStatus.CONFLICT,
      'This email already have an account in our system. Try to login!',
    );
  }

  if (
    payload?.password &&
    !(await User.isPasswordValid(payload.password, user.password))
  ) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Incorrect Password');
  }

  const jwtPayload = {
    email: user.email,
    role: user?.role,
  };

  const accessToken = createJwtToken(
    jwtPayload,
    config.access_token_private_key as string,
    config.access_token_expires_in as string,
  );
  const newData = user.toObject();
  delete newData.password;

  return { accessToken, newData };
};

export const UserService = {
  signupUser,
  loginUser,
};
