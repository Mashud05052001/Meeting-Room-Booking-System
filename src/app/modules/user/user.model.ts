import { Schema, model } from 'mongoose';
import { TUser, TUserModel } from './user.interface';
import { userRolesArray } from './user.constant';
import bcrypt from 'bcrypt';
import config from '../../config';

const userSchema = new Schema<TUser, TUserModel>(
  {
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
      default: 'user',
    },
    profilePicture: {
      type: String,
      default: '',
    },
    changePasswordAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

// make bcrypted password dureing signup
userSchema.pre('save', async function (next) {
  const hashedPassword = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_rounds),
  );
  this.password = hashedPassword;
  next();
});
// data sending time delete the password
userSchema.set('toJSON', {
  transform: function (doc, res) {
    delete res.password;
    return res;
  },
});

// Find out the user by email
userSchema.statics.findUser = async function (
  email: string,
  isPasswordRequired: boolean,
) {
  if (isPasswordRequired)
    return await User.findOne({ email }).select('+password');
  return await User.findOne({ email });
};

// validate the user password
userSchema.statics.isPasswordValid = async function (
  plainTextPassword: string,
  hashedPassword: string,
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

userSchema.statics.isJwtIssueBeforePasswordChange = function (
  jwtIssuedTime: number,
  passwordChangedDate: Date,
) {
  const passwordChangedTime = passwordChangedDate.getTime() / 1000;
  return jwtIssuedTime < passwordChangedTime;
};

export const User = model<TUser, TUserModel>('User', userSchema);
