import mongoose, { Schema, model } from 'mongoose';
import { TSlot } from './slot.interface';

const slotSchema = new Schema<TSlot>({
  room: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Room id is required'],
    ref: 'Room',
  },
  date: {
    type: String,
    required: [true, 'Slot date is required'],
  },
  startTime: {
    type: String,
    required: [true, 'Slot starting time is required'],
  },
  endTime: {
    type: String,
    required: [true, 'Slot ending time is required'],
  },
  slotDuration: {
    type: Number,
    required: [true, 'Slot duration is required'],
  },
  isBooked: {
    type: Boolean,
    default: false,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

export const Slot = model<TSlot>('Slot', slotSchema);
