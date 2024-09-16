import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { TRoom } from './room.interface';
import { Room } from './room.model';
import mongoose, { Document, Types } from 'mongoose';
import { Slot } from '../slot/slot.model';
import QueryBuilder from '../../builder/queryBuilder';

const createRoomIntoDB = async (payload: TRoom) => {
  const result = await Room.create(payload);
  return result;
};

const getAllRoomsFromDB = async (query: Record<string, unknown>) => {
  const roomQuery = new QueryBuilder(Room.find({ isDeleted: false }), query)
    .search(['name'])
    .filter(['sort', 'limit', 'searchTerm', 'page', 'fields', 'range'])
    .range()
    .sort()
    .paginate()
    .fields();

  const meta = await roomQuery.countTotal();
  const result = await roomQuery.modelQuery;

  return {
    data: result,
    meta,
  };
};

const getSingleRoomFromDB = async (id: string) => {
  const result = await Room.findById(id);

  if (result?.isDeleted) {
    throw new AppError(httpStatus.CONFLICT, 'The room is already deleted');
  }
  return result;
};
/*
1. Check the existancy of the room
2. Update premptive & non premptive data also
3. Update the non premptive amenities with case insensitively
*/
const updateRoomIntoDB = async (id: string, payload: Partial<TRoom>) => {
  const room = await Room.findById(id);
  if (!room) {
    throw new AppError(httpStatus.NOT_FOUND, 'This room is not found');
  }
  let result:
    | (Document<unknown, Record<string, unknown>, TRoom> &
        TRoom & {
          _id: Types.ObjectId;
        })
    | null = null;

  if (!payload?.amenities) {
    result = await Room.findByIdAndUpdate(id, payload, { new: true });
  } else {
    // const newAmenities = payload?.amenities;
    // const updatedAmenities = [...room.amenities];
    // const prevLowerCaseAmenities = room?.amenities.map((amenity) =>
    //   amenity.toLowerCase(),
    // );
    // newAmenities.forEach((amenity) => {
    //   if (!prevLowerCaseAmenities.includes(amenity.toLowerCase()))
    //     updatedAmenities.push(amenity);
    // });
    // payload.amenities = updatedAmenities;
    // result = await Room.findByIdAndUpdate(id, payload, { new: true });

    result = await Room.findByIdAndUpdate(
      id,
      {
        $addToSet: { amenities: { $each: payload.amenities } },
      },
      { new: true },
    );
  }
  return result;
};

const deleteRoomFromDB = async (id: string) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const deleteRoomResult = await Room.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session },
    );
    if (!deleteRoomResult) {
      throw new AppError(httpStatus.NOT_FOUND, 'Room not found');
    }
    await Slot.updateMany(
      { room: id },
      { isDeleted: true },
      { new: true, session },
    );
    await session.commitTransaction();
    await session.endSession();
    // return result;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'An error occurred while deleting the room',
    );
  }
  return "Room deleted successfully according it's all slots";
};

export const RoomService = {
  createRoomIntoDB,
  getAllRoomsFromDB,
  getSingleRoomFromDB,
  updateRoomIntoDB,
  deleteRoomFromDB,
};
