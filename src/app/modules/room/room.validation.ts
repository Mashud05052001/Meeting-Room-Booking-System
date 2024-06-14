import { z } from 'zod';

const createRoomValidationSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Room name is required',
      invalid_type_error: 'User name must be string',
    }),
    roomNo: z
      .number({
        required_error: 'Room number is required',
        invalid_type_error: 'Room number must be number',
      })
      .min(0, { message: 'Room number cannot be less then 0' }),
    floorNo: z
      .number({
        required_error: 'Room floor number password is required',
        invalid_type_error: 'Room floor number must be number',
      })
      .min(0, { message: 'Room floor number cannot be less then 0' }),
    capacity: z
      .number({
        required_error: 'Room capacity is required',
        invalid_type_error: 'Room capacity must be number',
      })
      .min(0, { message: 'Room capacity cannot be less then 0' }),
    pricePerSlot: z
      .number({
        required_error: 'Room price per slot is required',
        invalid_type_error: 'Room price per slot must be number',
      })
      .min(0, { message: 'Room price per slot cannot be less then 0' }),
    amenities: z.array(
      z.string({
        required_error: 'Amenities element must required',
        invalid_type_error: 'Amenities element must be string',
      }),
      {
        required_error: 'Amenities must required',
        invalid_type_error:
          'Amenities must contain an array of string elements',
      },
    ),
  }),
});

const updateRoomValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: 'Room name is required',
        invalid_type_error: 'User name must be string',
      })
      .optional(),
    roomNo: z
      .number({
        required_error: 'Room number is required',
        invalid_type_error: 'Room number must be number',
      })
      .min(0, { message: 'Room number cannot be less then 0' })
      .optional(),
    floorNo: z
      .number({
        required_error: 'Room floor number password is required',
        invalid_type_error: 'Room floor number must be number',
      })
      .min(0, { message: 'Room floor number cannot be less then 0' })
      .optional(),
    capacity: z
      .number({
        required_error: 'Room capacity is required',
        invalid_type_error: 'Room capacity must be number',
      })
      .min(0, { message: 'Room capacity cannot be less then 0' })
      .optional(),
    pricePerSlot: z
      .number({
        required_error: 'Room price per slot is required',
        invalid_type_error: 'Room price per slot must be number',
      })
      .min(0, { message: 'Room price per slot cannot be less then 0' })
      .optional(),
    amenities: z
      .array(
        z.string({
          required_error: 'Amenities element must required',
          invalid_type_error: 'Amenities element must be string',
        }),
        {
          required_error: 'Amenities must required',
          invalid_type_error:
            'Amenities must contain an array of string elements',
        },
      )
      .optional(),
  }),
});

export const RoomValidation = {
  createRoomValidationSchema,
  updateRoomValidationSchema,
};
