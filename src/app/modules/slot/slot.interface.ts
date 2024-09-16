import mongoose from 'mongoose';

export type TSlot = {
  room: mongoose.Types.ObjectId;
  date: string;
  startTime: string;
  endTime: string;
  slotDuration: number;
  isBooked?: boolean;
  isDeleted?: boolean;
};
