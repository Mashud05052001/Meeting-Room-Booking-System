import { Model } from 'mongoose';

export type TUser = {
  toObject?: any;
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  role: 'user' | 'admin';
};

export type TJwtPayload = {
  email: string;
  role: 'user' | 'admin';
};

export interface TUserModel extends Model<TUser> {
  findUser(email: string, isPasswordRequired: boolean): Promise<TUser>;
  isPasswordValid(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
}
