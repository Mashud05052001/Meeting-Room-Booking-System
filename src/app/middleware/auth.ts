import { catchAsync } from '../utils/catchAsync';
import { TUserRoles } from '../modules/user/user.constant';
import AppError from '../errors/AppError';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { User } from '../modules/user/user.model';

/* AUTH Middleware
1. Check token existancy
2. Extract decoded data from the token. Verify the token
3. Check provided rules is matched or not with the decoded data role
4. From decoded data check user is exist or not
5. Check if the token is before updatedPassword or not
*/

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

    // Check token role & user role same or not
    if (decoded.role !== user.role) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        'Authorization Failed due to invalid token',
      );
    }

    //Check if the token is before updatedPassword or not
    const passwordChangedTime = user?.changePasswordAt;
    if (
      passwordChangedTime &&
      User.isJwtIssueBeforePasswordChange(
        decoded.iat as number,
        passwordChangedTime,
      )
    ) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        'Authorization Failed due to user changed the password. Needs updated token!',
      );
    }
    req.user = decoded;
    next();
  });
};

export default auth;
