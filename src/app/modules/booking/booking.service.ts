import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import { TBooking } from './booking.interface';
import { Room } from '../room/room.model';
import { Slot } from '../slot/slot.model';
import { Booking } from './booking.model';
import mongoose from 'mongoose';
import { bookingStatus } from './booking.constant';
import { JwtPayload } from 'jsonwebtoken';

/*
1. Check the user existancy
2. Check the room existancy
3. Check the room is deleted or not
4. Get all the slots of the room on particular date which is available
5. If there any wrong slots id provide then throw an error with id to correct the id or remove it
6. Create a transaction rollback
    a. Update the slots status isBooked:true if payload.isConfirmed==='confirmed' then only this portion will works
    b. insert the payload to the booking
    c. create find operation to send the data of the booking using populate function
*/

const createBookingIntoDB = async (payload: TBooking) => {
  const { date, slots: providedSlots, room: roomId, user: userId } = payload;
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User doesn't exist");
  }
  const room = await Room.findRoom(roomId.toString());
  if (!room) {
    throw new AppError(httpStatus.NOT_FOUND, "Room doesn't exist");
  }
  if (room?.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'Room is already deleted');
  }
  const availableSlots = await Slot.find({
    date,
    _id: { $in: providedSlots },
    room: roomId,
    isBooked: false,
  });
  const availableSlotIds = availableSlots.map((slot) => slot._id.toString());
  const unavailableSlots = providedSlots.filter(
    (slot) => !availableSlotIds.includes(slot.toString()),
  );
  if (unavailableSlots.length > 0) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      `Slots with those ids are unavailable or deleted. ID: ${unavailableSlots}`,
    );
  }
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    // session 1 =>
    if (
      payload?.isConfirmed &&
      payload?.isConfirmed === bookingStatus.confirmed
    ) {
      const updateIsBookedStatusOnSlots = await Slot.updateMany(
        { _id: { $in: providedSlots } },
        { isBooked: true },
        { new: true, session },
      );
      if (!updateIsBookedStatusOnSlots) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          'Failed to update slot booking status',
        );
      }
    }

    // session 2
    payload.totalAmount = providedSlots.length * room.pricePerSlot;
    const insertDocsToBooking = await Booking.create([payload], { session });
    if (!insertDocsToBooking.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create bookings');
    }

    // session 3
    const bookingId = insertDocsToBooking[0]._id;
    const result = await Booking.findById(bookingId)
      .populate('room')
      .populate('user')
      .populate('slots')
      .session(session);
    if (!result) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create bookings');
    }

    await session.commitTransaction();
    await session.endSession();
    return result;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create bookings');
  }
};

const getAllBookingsFromDB = async () => {
  const result = await Booking.find()
    .populate('slots')
    .populate('room')
    .populate('user');
  return result;
};

const getSingleUserBookingsFromDB = async (payload: JwtPayload) => {
  const user = await User.findOne({ email: payload?.email }, { _id: 1 });
  const result = await Booking.find(
    { user: user?._id, isDeleted: false },
    { user: 0 },
  )
    .populate('slots')
    .populate('room');
  return result;
};

/*
1. Check booking existancy & isDeleted status 

Allow
1. unconfirmed -> confirmed  => 
   update the isConfirmed status on Booking + update the isBooked: true on particular slot
2. confirmed -> canceled  =>  
   update the isConfirmed status on Booking + update the isBooked: false on particular slot
3. unconfirmed -> canceled => 
   update only the isConfirmed status on Booking

DisAllow
1. confirmed -> unconfirmed
2. canceled -> unconfirmed
3. canceled -> confirmed
4. confirmed -> confirmed
5. unconfirmed -> unconfirmed
*/

const updateBookingIntoDB = async (
  id: string,
  payload: Pick<TBooking, 'isConfirmed'>,
) => {
  const booking = await Booking.findById(id).select(
    'isConfirmed slots isDeleted',
  );
  if (!booking) {
    throw new AppError(httpStatus.NOT_FOUND, 'Booking not found');
  } else if (booking.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'This booking was deleted');
  }
  const allSlots = booking.slots.map((slot) => slot.toString());
  const prevConfirmedStatus = booking.isConfirmed,
    updatedConfirmedStatus = payload.isConfirmed;
  if (prevConfirmedStatus === bookingStatus.canceled) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Confirmed status cannot be changed from ${bookingStatus.canceled} to ${payload.isConfirmed}`,
    );
  } else if (
    prevConfirmedStatus === bookingStatus.confirmed &&
    updatedConfirmedStatus === bookingStatus.unconfirmed
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Confirmed status cannot be changed from ${bookingStatus.confirmed} to ${payload.isConfirmed}`,
    );
  } else if (
    prevConfirmedStatus === bookingStatus.unconfirmed &&
    updatedConfirmedStatus === bookingStatus.unconfirmed
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Confirmed status value is already ${prevConfirmedStatus}`,
    );
  } else if (
    prevConfirmedStatus === bookingStatus.confirmed &&
    updatedConfirmedStatus === bookingStatus.confirmed
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Confirmed status value is already ${prevConfirmedStatus}`,
    );
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    let result: Record<string, unknown> | null = null;
    if (
      prevConfirmedStatus === bookingStatus.unconfirmed &&
      updatedConfirmedStatus === bookingStatus.confirmed
    ) {
      const updateSlots = await Slot.updateMany(
        {
          _id: { $in: allSlots },
        },
        { isBooked: true },
        { new: true, session },
      );
      if (!updateSlots) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          'Failed to update slot booking status',
        );
      }

      result = await Booking.findByIdAndUpdate(
        id,
        { isConfirmed: updatedConfirmedStatus },
        { new: true, session },
      );
      if (!result) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          'Failed to update Booking confirmed status',
        );
      }
    } else if (
      prevConfirmedStatus === bookingStatus.confirmed &&
      updatedConfirmedStatus === bookingStatus.canceled
    ) {
      const updateSlots = await Slot.updateMany(
        {
          _id: { $in: allSlots },
        },
        { isBooked: false },
        { new: true, session },
      );
      if (!updateSlots) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          'Failed to update slot booking status',
        );
      }

      result = await Booking.findByIdAndUpdate(
        id,
        { isConfirmed: updatedConfirmedStatus },
        { new: true, session },
      );
      if (!result) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          'Failed to update Booking confirmed status',
        );
      }
    } else if (
      prevConfirmedStatus === bookingStatus.unconfirmed &&
      updatedConfirmedStatus === bookingStatus.canceled
    ) {
      result = await Booking.findByIdAndUpdate(
        id,
        { isConfirmed: updatedConfirmedStatus },
        { new: true },
      );
      if (!result) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          'Failed to update Booking confirmed status',
        );
      }
    }

    await session.commitTransaction();
    await session.endSession();
    return result;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, 'Booking update failed');
  }
};

const deleteBookingFromDB = async (id: string) => {
  const booking = await Booking.findById(id).select('slots isDeleted');
  if (!booking) {
    throw new AppError(httpStatus.NOT_FOUND, 'Booking not found');
  }
  if (booking?.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'This booking is already deleted');
  }
  const allSlots = booking.slots.map((slot) => slot.toString());
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const updateSlots = await Slot.updateMany(
      {
        _id: { $in: allSlots },
      },
      { isBooked: false },
      { new: true, session },
    );
    if (!updateSlots) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Failed to update slot booking status',
      );
    }

    const result = await Booking.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session },
    );
    if (!result) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete booking');
    }

    await session.commitTransaction();
    await session.endSession();
    return result;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete booking');
  }
};

export const BookingService = {
  createBookingIntoDB,
  getAllBookingsFromDB,
  getSingleUserBookingsFromDB,
  updateBookingIntoDB,
  deleteBookingFromDB,
};

/*
{
  "date": "2024-08-15",
  "slots": ["666cc62ad75fbcf7e4de8d88"],
  "room": "666c7ea9186edf424f4990c6",
  "user": "666d29b55f743c1a29d86e7a"
}
 */
