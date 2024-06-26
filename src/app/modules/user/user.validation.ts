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

export const UserValidation = {
  signupValidationSchema,
  loginValidationSchema,
};
