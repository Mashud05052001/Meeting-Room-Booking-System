import { Model } from 'mongoose';

export type TUser = {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  role: 'user' | 'admin' | 'super-admin';
  profilePicture?: string;
  changePasswordAt?: Date;
};

export type TJwtPayload = {
  email: string;
  role: 'user' | 'admin' | 'super-admin';
};

export type TChangePassword = {
  oldPassword: string;
  newPassword: string;
};

export type TSendContactEmail = {
  userName: string;
  userEmail: string;
  message: string;
  sendToEmail: string;
};

export type TForgetPassword = Pick<TUser, 'email'>;

export type TResetPassword = Pick<TUser, 'email' | 'password'>;

export interface TUserModel extends Model<TUser> {
  findUser(email: string, isPasswordRequired: boolean): Promise<TUser>;
  isPasswordValid(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
  isJwtIssueBeforePasswordChange(
    jwtIssuedTime: number,
    passwordChangedDate: Date,
  ): boolean;
}
