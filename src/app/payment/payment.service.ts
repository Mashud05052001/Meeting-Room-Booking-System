import httpStatus from 'http-status';
import { catchAsync } from '../utils/catchAsync';
import sendResponse from '../utils/sendResponse';
import { TPayment } from './payment.interface';
import { initiatePayment, verifyPayment } from './payment.utils';
import { BookingService } from '../modules/booking/booking.service';
import { TBooking } from '../modules/booking/booking.interface';
import { Types } from 'mongoose';
import path from 'path';
import fs from 'fs';
import { Booking } from '../modules/booking/booking.model';

const convertObjectId = (str: string) => new Types.ObjectId(str);

const createPayment = catchAsync(async (req, res) => {
  const data = req?.body as TPayment;
  const bookingsData: TBooking = {
    room: convertObjectId(data.room),
    date: data.date,
    slots: data.slots.map((slot) => convertObjectId(slot)),
    user: convertObjectId(data.user),
    totalAmount: data.totalAmount,
    isConfirmed: 'unconfirmed',
    paymentStatus: 'non-paid',
    isDeleted: false,
  };

  const bookingInfo =
    await BookingService.createBookingBeforePayment(bookingsData);

  const result = await initiatePayment(req?.body, bookingInfo?._id.toString());
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Initiate payment successfully',
    data: result,
  });
});

const confirmationPayment = catchAsync(async (req, res) => {
  const bookingId = req?.query?.bookingId as string;
  const transactionId = req?.query?.transactionId as string;
  console.log(transactionId, 'mashuidu');

  const paymentVerification = await verifyPayment(transactionId);
  let message = '',
    description = '',
    className = '',
    icon = '';
  const confirmationHtmlFilePath = path.join(__dirname, './payment.html');
  let templete = fs.readFileSync(confirmationHtmlFilePath, 'utf-8');
  console.log(paymentVerification);
  if (paymentVerification.pay_status === 'Successful') {
    await BookingService.updateBookingAfterSuccessfullPayment(
      bookingId,
      transactionId,
    );
    message = 'Successfully Paid';
    className = 'successfull';
    description = `Thank you for your payment.<br>Your transaction has been completed successfully.<br>TransactionId: ${transactionId}`;
    icon = '&#10003;';
  } else {
    await Booking.deleteOne({ _id: bookingId });
    message = 'Failed';
    className = 'failed';
    description =
      'Unfortunately, your payment could not be processed. Please try again or contact support.';
    icon = '&#10060;';
  }
  templete = templete
    .replace('{{status}}', message)
    .replace('{{dynamicClass}}', className)
    .replace('{{description}}', description)
    .replace('{{icon}}', icon);

  res.send(templete);
});

const paymentCancelled = catchAsync(async (req) => {
  const bookingId = req?.query?.bookingId as string;
  const returnUrl = req?.query?.returnUrl as string;

  await Booking.deleteOne({ _id: bookingId });
  return returnUrl;
});

export const PaymentService = {
  createPayment,
  confirmationPayment,
  paymentCancelled,
};
