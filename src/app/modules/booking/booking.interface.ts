import mongoose from 'mongoose';

export type TConfirmed = 'confirmed' | 'unconfirmed' | 'canceled';

export type TBooking = {
  room: mongoose.Types.ObjectId;
  slots: mongoose.Types.ObjectId[];
  user: mongoose.Types.ObjectId;
  date: string;
  totalAmount?: number;
  isConfirmed?: TConfirmed;
  isDeleted?: boolean;
  paymentStatus?: 'paid' | 'non-paid' | '';
  transactionId?: string;
};
