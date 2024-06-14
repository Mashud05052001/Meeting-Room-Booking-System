import { Schema } from 'mongoose';
import { TRoom } from './room.interface';

export const RoomSchema = new Schema<TRoom>({
  name: {
    type: String,
    required: [true, 'Room name is required'],
  },
  roomNo: {
    type: String,
    required: [true, 'Room No is required'],
  },
  // floorNo
  // capacity
  // pricePerSlot
  // amenities,
  // isDeleted
});
