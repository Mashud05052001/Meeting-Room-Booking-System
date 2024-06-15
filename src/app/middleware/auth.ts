import { catchAsync } from '../utils/catchAsync';
import { TUserRoles } from '../modules/user/user.constant';
import AppError from '../errors/AppError';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { User } from '../modules/user/user.model';

const auth = (...requiredRoles: TUserRoles[]) => {
  return catchAsync(async (req, res, next) => {
    const token = (req?.headers?.authorization as string)?.split(' ')[1];
    // Token availability
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'Token is missing!');
    }
    // Token validity check and send decoded data to the req.user
    const decoded = jwt.verify(
      token,
      config.access_token_private_key as string,
    ) as JwtPayload;
    req.user = decoded;
    // checking the provided role & decoded user role
    if (requiredRoles && !requiredRoles.includes(decoded?.role)) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        `Authorization Failed cause or role not matching!`,
      );
    }

    // Check user existancy
    const user = await User.findUser(decoded?.email, false);
    if (!user) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'User not found!');
    }
    next();
  });
};

export default auth;
