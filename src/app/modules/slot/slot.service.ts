import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { Room } from '../room/room.model';
import { TSlot } from './slot.interface';
import { Slot } from './slot.model';
import { slotsGenerator } from './slot.utils';

const createSlotIntoDB = async (payload: TSlot) => {
  const isRoomExist = await Room.findRoom(payload?.room.toString());
  if (!isRoomExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'This room not exist!');
  }
  if (isRoomExist?.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'This room is already deleted!');
  }

  // TOTO : Slot duretion dynamically time period confuse
  const slotDuration = 60;
  const multipleSlotsData = slotsGenerator(payload, slotDuration);

  const result = await Slot.create(...multipleSlotsData);
  return result;
};

const getAllSlotsFromDB = async (query: Record<string, unknown>) => {
  let searchQuery: Record<string, unknown> = {};
  if (Object.keys(query).length === 0) searchQuery.isBooked = false;
  else {
    if (query?.date) searchQuery.date = query.date;
    if (query?.roomId) searchQuery.room = query.roomId;
  }

  const result = await Slot.find(searchQuery);
  return result;
};

export const SlotService = {
  createSlotIntoDB,
  getAllSlotsFromDB,
};
