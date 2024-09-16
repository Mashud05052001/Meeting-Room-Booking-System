import mongoose, { Schema, model } from 'mongoose';
import { TBooking } from './booking.interface';
import { bookingConfirmationStatus, paymentStatus } from './booking.constant';

const bookingSchema = new Schema<TBooking>({
  room: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Room Id is required'],
    ref: 'Room',
  },
  slots: {
    type: [mongoose.Schema.Types.ObjectId],
    required: [true, 'Slots Id are required'],
    ref: 'Slot',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'User Id is required'],
    ref: 'User',
  },
  date: {
    type: String,
    required: [true, 'Date is required'],
  },
  totalAmount: {
    type: Number,
  },
  isConfirmed: {
    type: String,
    enum: {
      values: bookingConfirmationStatus,
      message:
        "{VALUE} is not valid confirmation status. It can be either 'confirmed' or 'unconfirmed' or 'canceled'",
    },
    default: 'unconfirmed',
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  paymentStatus: {
    type: String,
    enum: {
      values: paymentStatus,
      message:
        "{VALUE} is not valid payment status. It can be either 'paid' or 'non-paid' or ''",
    },
    default: '',
  },
  transactionId: {
    type: String,
    default: '',
  },
});

export const Booking = model<TBooking>('Booking', bookingSchema);
