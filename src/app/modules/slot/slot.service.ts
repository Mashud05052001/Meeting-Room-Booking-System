import httpStatus from 'http-status';
import moment from 'moment';
import mongoose from 'mongoose';
import AppError from '../../errors/AppError';
import { Room } from '../room/room.model';
import { TSlot } from './slot.interface';
import { Slot } from './slot.model';
import { slotsGenerator } from './slot.utils';

/* Slot Creation
  1. Check if the room exists.
  2. If the room exists, check if it's deleted.
  3. Get all previous slots for the same room and same date.
  4. Check if the slot's start and end times conflict with existing slots.
  5. If no conflict, generate and save the slot(s).
  */
const createSlotIntoDB = async (payload: TSlot) => {
  const isRoomExist = await Room.findRoom(payload?.room.toString());
  if (!isRoomExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'This room not exist!');
  }
  if (isRoomExist?.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'This room is already deleted!');
  }

  const previousSameDateSameRoomSlots = await Slot.find({
    date: payload.date,
    room: payload.room,
  });
  const isSlotAvailable = previousSameDateSameRoomSlots.every((slot) => {
    const newStartTime = moment(payload.startTime, 'HH:mm');
    const newEndTime = moment(payload.endTime, 'HH:mm');
    const existingStartTime = moment(slot.startTime, 'HH:mm');
    const existingEndTime = moment(slot.endTime, 'HH:mm');

    return (
      newStartTime.isSameOrAfter(existingEndTime) ||
      newEndTime.isSameOrBefore(existingStartTime) ||
      (existingStartTime.isBefore(newStartTime) &&
        newEndTime.isBefore(existingEndTime) &&
        newEndTime.diff(newStartTime, 'minutes') >= payload.slotDuration)
    );
  });
  if (!isSlotAvailable) {
    const previousSlots = previousSameDateSameRoomSlots.map(
      (slot) => `${slot.startTime}-${slot.endTime}`,
    );
    const bookedSlotsText = previousSlots.join(', ');
    throw new AppError(
      httpStatus.CONFLICT,
      `Slot time conflicts with existing ones. Please choose anothe slots time. Created slots time are ${bookedSlotsText}`,
    );
  }

  const multipleSlotsData = slotsGenerator(payload);
  const result = await Slot.create(...multipleSlotsData);
  return result;
};

/* Get All Slots
  1. Build a search query with filters such as isBooked, date, room, and slot duration.
  2. Aggregate the slots by room and date.
  3. Perform a lookup to fetch room information.
  4. Return the result with room and slot details.
*/
const getAllSlotsFromDB = async (query: Record<string, unknown>) => {
  const searchQuery: Record<string, unknown> = {
    isDeleted: false,
  };
  if (Object.keys(query).length > 0) {
    if (query?.isBooked)
      searchQuery.isBooked = query.isBooked === 'false' ? false : true;
    if (query?.isDeleted)
      searchQuery.isDeleted = query.isDeleted === 'true' ? true : false;
    if (query?.date) searchQuery.date = query.date;
    if (query?.roomId)
      searchQuery.room = new mongoose.Types.ObjectId(query.roomId as string);
    if (query?.slotDuration)
      searchQuery.slotDuration = Number(query.slotDuration);
  }

  // const result = await Slot.aggregate([
  //   {
  //     $match: {
  //       ...searchQuery,
  //     },
  //   },
  //   {
  //     $group: {
  //       _id: { room: '$room', date: '$date' },
  //       slots: {
  //         $push: {
  //           _id: '$_id',
  //           startTime: '$startTime',
  //           endTime: '$endTime',
  //           slotDuration: '$slotDuration',
  //           isBooked: '$isBooked',
  //           isDeleted: '$isDeleted',
  //         },
  //       },
  //     },
  //   },
  //   {
  //     $group: {
  //       _id: { room: '$_id.room' },
  //       specificDateSlots: {
  //         $push: {
  //           date: '$_id.date',
  //           slots: '$slots',
  //         },
  //       },
  //     },
  //   },
  //   {
  //     $lookup: {
  //       from: 'rooms',
  //       localField: '_id.room',
  //       foreignField: '_id',
  //       as: 'roomInfo',
  //     },
  //   },
  //   {
  //     $unwind: {
  //       path: '$roomInfo',
  //       preserveNullAndEmptyArrays: true,
  //     },
  //   },
  //   {
  //     $project: {
  //       _id: 0,
  //       room: '$_id.room',
  //       roomInfo: 1,
  //       specificDateSlots: 1,
  //     },
  //   },
  // ]);

  // return result;

  const limit = Number(query?.limit) || 10; // Number of slots per page
  const page = Number(query?.page) || 1; // Current page (can be passed as a query parameter)
  const skip = (page - 1) * limit; // Calculate how many slots to skip

  const result = await Slot.aggregate([
    {
      $match: {
        ...searchQuery,
      },
    },
    {
      $facet: {
        paginatedResults: [
          {
            $skip: skip,
          },
          {
            $limit: limit,
          },
          {
            $group: {
              _id: { room: '$room', date: '$date' },
              slots: {
                $push: {
                  _id: '$_id',
                  startTime: '$startTime',
                  endTime: '$endTime',
                  slotDuration: '$slotDuration',
                  isBooked: '$isBooked',
                  isDeleted: '$isDeleted',
                },
              },
            },
          },
          {
            $group: {
              _id: { room: '$_id.room' },
              specificDateSlots: {
                $push: {
                  date: '$_id.date',
                  slots: '$slots',
                },
              },
            },
          },
          {
            $lookup: {
              from: 'rooms',
              localField: '_id.room',
              foreignField: '_id',
              as: 'roomInfo',
            },
          },
          {
            $unwind: {
              path: '$roomInfo',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $project: {
              _id: 0,
              room: '$_id.room',
              roomInfo: 1,
              specificDateSlots: 1,
            },
          },
        ],
        totalCount: [
          {
            $group: {
              _id: null,
              totalData: { $sum: 1 },
            },
          },
        ],
      },
    },
  ]);

  const paginatedResults = result[0].paginatedResults;
  const totalData = result[0].totalCount[0]?.totalData || 0;
  const totalPage = Math.ceil(totalData / limit);

  return {
    data: paginatedResults,
    meta: {
      totalData,
      limit,
      page,
      skip,
      totalPage,
    },
  };
};

/* Get All Slots
  1. Build a search query with filters such as isBooked, date, room, and slot duration.
  2. Aggregate the slots by room and date.
  3. Perform a lookup to fetch room information.
  4. Return the result with room and slot details.
*/
const getSingleSlotFromDB = async (id: string) => {
  const result = await Slot.findById(id).populate('room');
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Slot not found!');
  }
  if (result.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, 'The slot is deleted');
  }

  return result;
};

const getMultipleSlotsFromDB = async (payload: string[]) => {
  const objectIDs = payload.map((id) => new mongoose.Types.ObjectId(id));
  const result = await Slot.aggregate([
    {
      $match: {
        _id: { $in: objectIDs },
        isBooked: false,
        isDeleted: false,
      },
    },
    {
      $group: {
        _id: {
          roomId: `$room`,
        },
        slots: {
          $push: {
            _id: `$_id`,
            date: `$date`,
            room: `$room`,
            startTime: `$startTime`,
            endTime: `$endTime`,
            slotDuration: `$slotDuration`,
            isBooked: `$isBooked`,
            isDeleted: `$isDeleted`,
          },
        },
      },
    },
    {
      $lookup: {
        from: 'rooms',
        foreignField: '_id',
        localField: `_id.roomId`,
        as: 'room',
      },
    },
    { $unwind: '$room' },
    {
      $project: {
        _id: 0,
      },
    },
  ]);
  return result;
};

/* Slot Deletion
  1. Fetch the slot by ID.
  2. If the slot doesn't exist or is already deleted, throw an error.
  3. If valid, mark the slot as deleted.
*/
const deleteSlotFromDB = async (id: string) => {
  const slot = await Slot.findById(id);
  if (!slot) {
    throw new AppError(httpStatus.NOT_FOUND, 'This slot is not found');
  } else if (slot.isDeleted) {
    throw new AppError(httpStatus.CONFLICT, 'This slot is already deleted');
  }
  await Slot.findByIdAndUpdate(id, { isDeleted: true });
  return 'Slot deleted successfully';
};

/* Slot Update
  1. Fetch the slot by ID.
  2. If the slot doesn't exist or is deleted, throw an error.
  3. Update the slot's date, start time, and end time as per the provided data.
  4. Check if the updated time conflicts with other existing slots.
  5. If no conflict, calculate and update the slot's duration.
*/
const updateSlotIntoDB = async (
  id: string,
  payload: Pick<TSlot, 'date' | 'startTime' | 'endTime'>,
) => {
  const slotToUpdate = await Slot.findById(id);
  if (!slotToUpdate) {
    throw new AppError(httpStatus.NOT_FOUND, 'Slot not found!');
  } else if (slotToUpdate.isDeleted) {
    throw new AppError(httpStatus.CONFLICT, 'This slot is already deleted');
  }
  if (payload.date) slotToUpdate.date = payload.date;
  if (payload.startTime) slotToUpdate.startTime = payload.startTime;
  if (payload.endTime) slotToUpdate.endTime = payload.endTime;

  const otherSlots = await Slot.find({
    date: payload.date || slotToUpdate.date,
    _id: { $ne: id },
  });

  const isSlotAvailable = otherSlots.every((slot) => {
    const newStartTime = moment(
      payload.startTime || slotToUpdate.startTime,
      'HH:mm',
    );
    const newEndTime = moment(payload.endTime || slotToUpdate.endTime, 'HH:mm');
    const existingStartTime = moment(slot.startTime, 'HH:mm');
    const existingEndTime = moment(slot.endTime, 'HH:mm');

    return (
      newStartTime.isSameOrAfter(existingEndTime) ||
      newEndTime.isSameOrBefore(existingStartTime)
    );
  });

  if (!isSlotAvailable) {
    const conflictingSlots = otherSlots.map(
      (slot) => `${slot.startTime}-${slot.endTime}`,
    );
    const bookedSlotsText = conflictingSlots.join(', ');
    throw new AppError(
      httpStatus.CONFLICT,
      `Slot time conflicts with existing ones. Conflicting slots: ${bookedSlotsText}`,
    );
  }
  const startTimeMoment = moment(payload.startTime, 'HH:mm');
  const endTimeMoment = moment(payload.endTime, 'HH:mm');
  const durationInMinutes = endTimeMoment.diff(startTimeMoment, 'minutes');
  slotToUpdate.slotDuration = durationInMinutes;

  await slotToUpdate.save();

  return slotToUpdate;
};

const getAllDateOfASlot = async (id: string) => {
  const room = await Room.findById(id);
  if (!room) {
    throw new AppError(httpStatus.NOT_FOUND, 'This room is not found');
  }
  const result = await Slot.distinct('date', {
    room: id,
    isBooked: false,
    isDeleted: false,
  });
  return result;
};

export const SlotService = {
  createSlotIntoDB,
  getAllSlotsFromDB,
  getSingleSlotFromDB,
  getMultipleSlotsFromDB,
  deleteSlotFromDB,
  updateSlotIntoDB,
  getAllDateOfASlot,
};
