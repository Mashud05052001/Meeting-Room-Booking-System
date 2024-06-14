import jwt from 'jsonwebtoken';
import { TJwtPayload } from './user.interface';

export const createJwtToken = (
  payload: TJwtPayload,
  secretCode: string,
  expiresIn: string,
) => {
  return jwt.sign(payload, secretCode, { expiresIn });
};
