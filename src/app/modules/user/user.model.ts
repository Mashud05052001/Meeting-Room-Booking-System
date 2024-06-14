import { Schema, model } from 'mongoose';
import { TUser, TUserModel } from './user.interface';
import { userRolesArray } from './user.constant';
import bcrypt from 'bcrypt';
import config from '../../config';

const userSchema = new Schema<TUser, TUserModel>({
  name: {
    type: String,
    required: [true, 'User name is required'],
  },
  email: {
    type: String,
    required: [true, 'User email is required'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'User password is required'],
    select: 0,
  },
  phone: {
    type: String,
    required: [true, 'User phone number is required'],
  },
  address: {
    type: String,
    required: [true, 'User address is required'],
  },
  role: {
    type: String,
    enum: {
      values: userRolesArray,
      message: `{VALUE} is not a valid role. Role can be either 'user' or 'admin'`,
    },
  },
});

// make bcrypted password dureing signup
userSchema.pre('save', async function (next) {
  const hashedPassword = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_rounds),
  );
  this.password = hashedPassword;
  next();
});
// after signup the password field removing
userSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret.password;
    return ret;
  },
});

userSchema.statics.findUser = async function (
  email: string,
  isPasswordRequired: boolean,
) {
  if (isPasswordRequired)
    return await User.findOne({ email }).select('+password');
  return await User.findOne({ email });
};

userSchema.statics.isPasswordValid = async function (
  plainTextPassword: string,
  hashedPassword: string,
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

export const User = model<TUser, TUserModel>('User', userSchema);
