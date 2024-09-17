import { z } from 'zod';
import { userRolesArray } from './user.constant';

const signupValidationSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'User name is required',
      invalid_type_error: 'User name must be string',
    }),
    email: z
      .string({ required_error: 'User email is required' })
      .email({ message: 'Provide a valid email' }),
    password: z.string({
      required_error: 'User password is required',
      invalid_type_error: 'User password must be string',
    }),
    phone: z.string({
      required_error: 'User phone number is required',
      invalid_type_error: 'User phone number must be string',
    }),
    address: z.string({
      required_error: 'User address is required',
      invalid_type_error: 'User address must be string',
    }),
    role: z
      .enum(userRolesArray as [string, ...string[]], {
        required_error: 'User role is required',
        invalid_type_error: `User role can be either 'user' or 'admin'`,
      })
      .default('user')
      .optional(),
  }),
});

const updateUserValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        invalid_type_error: 'User name must be string',
      })
      .optional(),
    email: z
      .string({ required_error: 'User email is required' })
      .email({ message: 'Provide a valid email' }),
    phone: z
      .string({
        invalid_type_error: 'User phone number must be string',
      })
      .optional(),
    address: z
      .string({
        invalid_type_error: 'User address must be string',
      })
      .optional(),
    profilePicture: z
      .string({
        invalid_type_error: 'Profile picture must be string',
      })
      .url()
      .optional(),
  }),
});
const updateUserRoleValidationSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: 'User email is required' })
      .email({ message: 'Provide a valid email' }),
    role: z.enum(userRolesArray as [string, ...string[]], {
      required_error: 'User role is required',
      invalid_type_error: `User role can be either 'user' or 'admin'`,
    }),
  }),
});

const loginValidationSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: 'User email is required' })
      .email({ message: 'Provide a valid email' }),
    password: z.string({
      required_error: 'User password is required',
      invalid_type_error: 'User password must be string',
    }),
  }),
});

const changePasswordValidationSchema = z.object({
  body: z.object({
    oldPassword: z.string({
      required_error: 'Old password is required',
      invalid_type_error: 'Old password must be string',
    }),
    newPassword: z.string({
      required_error: 'New password is required',
      invalid_type_error: 'New password must be string',
    }),
  }),
});

const generateAccessTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: 'Refresh Token is required',
    }),
  }),
});

const forgetPasswordValidationSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: 'User email is required' })
      .email({ message: 'Provide a valid email' }),
  }),
});

const resetPasswordValidationSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: 'User email is required' })
      .email({ message: 'Provide a valid email' }),
    password: z.string({
      required_error: 'User password is required',
      invalid_type_error: 'User password must be string',
    }),
  }),
});

const sendEmailValidationSchem = z.object({
  body: z.object({
    userEmail: z
      .string()
      .email('Invalid email format')
      .nonempty('User email is required'),
    sendToEmail: z
      .string()
      .email('Invalid email format')
      .nonempty('Recipient email is required'),
    message: z
      .string()
      .min(3, { message: '*Message must be at least 5 characters' }),
    userName: z
      .string()
      .min(3, { message: '*Name must be at least 3 characters' }),
  }),
});

export const UserValidation = {
  signupValidationSchema,
  updateUserValidationSchema,
  updateUserRoleValidationSchema,
  loginValidationSchema,
  changePasswordValidationSchema,
  generateAccessTokenValidationSchema,
  forgetPasswordValidationSchema,
  resetPasswordValidationSchema,
  sendEmailValidationSchem,
};
