import { z } from 'zod';
import { Types } from 'mongoose';

const bookingValidationSchema = z.object({
  body: z.object({
    customerName: z.string({
      required_error: 'Customer name is required',
    }),
    customerEmail: z
      .string({ required_error: 'Customer email is required' })
      .email({ message: 'Provide a valid email' }),
    customerPhone: z.string({
      required_error: 'Customer phone number is required',
    }),
    date: z.string({ required_error: 'Booding date is required' }),
    cancleUrl: z
      .string({ invalid_type_error: 'Cancle url is required' })
      .url('Invalid URL format'),
    room: z.string().refine((id) => Types.ObjectId.isValid(id), {
      message: 'Invalid room ID',
    }),
    slots: z.array(
      z.string().refine((id) => Types.ObjectId.isValid(id), {
        message: 'Invalid slots ID',
      }),
      { invalid_type_error: 'Array of slots are required' },
    ),
    user: z.string().refine((id) => Types.ObjectId.isValid(id), {
      message: 'Invalid user ID',
    }),
    totalAmount: z.number().positive('Total amount must be greater than 0'),
  }),
});

export default bookingValidationSchema;
