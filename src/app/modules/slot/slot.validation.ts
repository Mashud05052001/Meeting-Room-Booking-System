import { z } from 'zod';
import {
  checkStartTimeIsBeforeOrNotEndTime,
  checkValidDate,
  checkValidTime,
} from './slot.utils';

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
      slotDuration: z.number({
        required_error: 'Slot duration is required',
        invalid_type_error: 'Slot duration must be number format',
      }),
      isBooked: z
        .boolean({
          invalid_type_error: 'isBooked must be boolean format',
        })
        .optional()
        .default(false),
      isDeleted: z
        .boolean({
          invalid_type_error: 'isDeleted must be boolean format',
        })
        .optional()
        .default(false),
    })
    .refine(checkStartTimeIsBeforeOrNotEndTime, {
      message: 'StartTime should be before EndTime',
    }),
});

const updateSlotValidationSchema = z.object({
  body: z
    .object({
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
    })
    .refine(checkStartTimeIsBeforeOrNotEndTime, {
      message: 'StartTime should be before EndTime',
    }),
});

const getMultipleSlotsValidationSchema = z.object({
  body: z.object({
    slots: z
      .array(
        z.string({ required_error: 'Each slot must be a valid string ID' }),
        { required_error: 'An array of slot IDs is required' },
      )
      .min(1, 'At least one slot ID must be provided'),
  }),
});

export const SlotValidation = {
  createSlotValidationSchema,
  updateSlotValidationSchema,
  getMultipleSlotsValidationSchema,
};
