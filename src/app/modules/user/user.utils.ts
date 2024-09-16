import jwt, { JwtPayload } from 'jsonwebtoken';
import { TJwtPayload } from './user.interface';
import bcrypt from 'bcrypt';
import config from '../../config';

export const createJwtToken = (
  payload: TJwtPayload,
  secretCode: string,
  expiresIn: string,
) => {
  return jwt.sign(payload, secretCode, { expiresIn });
};

export const createJwtAccessToken = (
  payload: TJwtPayload,
  expiresIn = config.access_token_expires_in,
) => {
  return jwt.sign(payload, config.access_token_private_key as string, {
    expiresIn,
  });
};
export const createJwtRefreshToken = (payload: TJwtPayload) => {
  return jwt.sign(payload, config.refresh_token_private_key as string, {
    expiresIn: config.refresh_token_expires_in,
  });
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(
    token,
    config.access_token_private_key as string,
  ) as JwtPayload;
};

export const verifyRefrestToken = (token: string) => {
  return jwt.verify(
    token,
    config.refresh_token_private_key as string,
  ) as JwtPayload;
};

export const createHashedPassword = async (password: string) => {
  const hashedPassword = await bcrypt.hash(
    password,
    Number(process.env.BCRYPT_SALT_ROUNDS),
  );
  return hashedPassword;
};

export const compareHashedPasswordWithPlainText = async (
  hashedPassword: string,
  plainText: string,
) => {
  const result = await bcrypt.compare(hashedPassword, plainText);
  return result;
};
