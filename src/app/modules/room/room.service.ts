import httpStatus from 'http-status';
import AppError from '../../errors/ArrError';
import { TRoom } from './room.interface';
import { Room } from './room.model';
import { Document, Types } from 'mongoose';

const createRoomIntoDB = async (payload: TRoom) => {
  const result = await Room.create(payload);
  return result;
};

const getAllRoomsFromDB = async () => {
  const result = await Room.find({ isDeleted: false });
  return result;
};

const getSingleRoomFromDB = async (id: string) => {
  const result = await Room.findById(id);

  if (result?.isDeleted) {
    throw new AppError(httpStatus.CONFLICT, 'The room is already deleted');
  }
  return result;
};

const updateRoomIntoDB = async (id: string, payload: Partial<TRoom>) => {
  let result:
    | (Document<unknown, {}, TRoom> &
        TRoom & {
          _id: Types.ObjectId;
        })
    | null = null;
  if (!payload?.amenities) {
    result = await Room.findByIdAndUpdate(id, payload, { new: true });
  } else {
    const room = await Room.findRoom(id);
    const newAmenities = payload?.amenities;
    const updatedAmenities = [...room?.amenities];
    const prevLowerCaseAmenities = room?.amenities.map((amenity) =>
      amenity.toLowerCase(),
    );
    newAmenities.forEach((amenity) => {
      if (!prevLowerCaseAmenities.includes(amenity.toLowerCase()))
        updatedAmenities.push(amenity);
    });
    payload.amenities = updatedAmenities;
    result = await Room.findByIdAndUpdate(id, payload, { new: true });
  }
  return result;
};

const deleteRoomFromDB = async (id: string) => {
  // TODO : delete a room to delete all slots accordint the room
  const result = await Room.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  return result;
};

export const RoomService = {
  createRoomIntoDB,
  getAllRoomsFromDB,
  getSingleRoomFromDB,
  updateRoomIntoDB,
  deleteRoomFromDB,
};
