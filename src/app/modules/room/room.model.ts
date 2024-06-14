import { Schema, model } from 'mongoose';
import { TRoom, TRoomModel } from './room.interface';

const roomSchema = new Schema<TRoom, TRoomModel>({
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

roomSchema.statics.findRoom = async function (id: string) {
  return await Room.findById(id);
};

export const Room = model<TRoom, TRoomModel>('Room', roomSchema);
