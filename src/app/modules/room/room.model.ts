import { Schema, model } from 'mongoose';
import { TRoom } from './room.interface';

const RoomSchema = new Schema<TRoom>({
  name: {
    type: String,
    required: [true, 'Room name is required'],
  },
  roomNo: {
    type: Number,
    required: [true, 'Room No is required'],
  },
  floorNo: {
    type: Number,
    required: [true, 'Room floor no is required'],
  },
  capacity: {
    type: Number,
    required: [true, 'Room capacity is required'],
  },
  pricePerSlot: {
    type: Number,
    required: [true, 'Room price per slot is required'],
  },
  amenities: {
    type: [String],
    required: [true, 'Room amenities are required'],
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

export const Room = model<TRoom>('Room', RoomSchema);
