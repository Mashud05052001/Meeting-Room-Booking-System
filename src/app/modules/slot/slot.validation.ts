import { number, z } from 'zod';
import AppError from '../../errors/ArrError';
import httpStatus from 'http-status';
import {
  checkStartTimeIsBeforeOrNotEndTime,
  checkValidDate,
  checkValidTime,
} from './slot.utils';
import { TRoom } from '../room/room.interface';

const createSlotValidationSchema = z.object({
  body: z
    .object({
      room: z.string({
        required_error: 'Room id is required',
        invalid_type_error: 'Room must be string',
      }),
      date: z
        .string({
          required_error: 'Date is required',
          invalid_type_error: 'Date must be string of YYYY-MM-DD format',
        })
        .refine(checkValidDate),
      startTime: z
        .string({
          required_error: 'Starting time is required',
          invalid_type_error: 'Starting time must be string of format HH:MM',
        })
        .refine(checkValidTime),
      endTime: z
        .string({
          required_error: 'Ending time is required',
          invalid_type_error: 'Ending time must be string of format HH:MM',
        })
        .refine(checkValidTime),
      isBooked: z
        .boolean({
          invalid_type_error: 'isBooked must be boolean format',
        })
        .optional(),
    })
    .refine(checkStartTimeIsBeforeOrNotEndTime, {
      message: 'StartTime should be before EndTime',
    }),
});

export const SlotValidation = {
  createSlotValidationSchema,
};
