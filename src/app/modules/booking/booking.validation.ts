import { z } from 'zod';
import { checkValidDate } from '../slot/slot.utils';
import { bookingConfirmationStatus } from './booking.constant';

const createBookingValidationSchema = z.object({
  body: z.object({
    room: z.string({
      required_error: 'Room Id is required',
      invalid_type_error: 'Room Id must be string',
    }),
    slots: z.array(
      z.string({
        required_error: 'Slot elements are required',
        invalid_type_error: 'Slot elements must be string',
      }),
      {
        required_error: 'Slots are required',
        invalid_type_error: 'Slots must be array of string',
      },
    ),
    user: z.string({
      required_error: 'User is required',
      invalid_type_error: 'User must be string',
    }),
    date: z
      .string({
        required_error: 'Date is required',
        invalid_type_error: 'Date must be string of YYYY-MM-DD format',
      })
      .refine(checkValidDate, {
        message: 'Date must be string of YYYY-MM-DD format ',
      }),
    totalAmount: z.number().optional(),
    isConfirmed: z
      .enum(bookingConfirmationStatus as [string, ...string[]], {
        message: `{VALUE} is not a valid isConfirmed status. IsConfirmed status can be 'confirmed' or 'unconfirmed' or 'canceled'`,
      })
      .optional(),

    isDeleted: z
      .boolean({
        invalid_type_error: 'isDeleted must be boolean',
      })
      .optional(),
  }),
});

const updateBookingValidationSchema = z.object({
  body: z.object({
    isConfirmed: z.enum(bookingConfirmationStatus as [string, ...string[]], {
      message: `{VALUE} is not a valid isConfirmed status. IsConfirmed status can be 'confirmed' or 'unconfirmed' or 'canceled'`,
    }),
  }),
});

export const BookingValidation = {
  createBookingValidationSchema,
  updateBookingValidationSchema,
};
