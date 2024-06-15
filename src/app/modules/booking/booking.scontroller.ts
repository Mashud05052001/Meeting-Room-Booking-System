import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { BookingService } from './booking.service';

const createBooking = catchAsync(async (req, res, next) => {
  const data = req?.body;
  const result = await BookingService.createBookingIntoDB(data);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Booking created successfully',
    data: result,
  });
});

const getAllBookings = catchAsync(async (req, res, next) => {
  const result = await BookingService.getAllBookingsFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All bookings retrieved successfully',
    data: result,
  });
});

const getSingleUserBookings = catchAsync(async (req, res, next) => {
  const userData = req?.user;
  const result = await BookingService.getSingleUserBookingsFromDB(userData);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User bookings retrieved successfully',
    data: result,
  });
});

const updateBooking = catchAsync(async (req, res, next) => {
  const updatedData = req?.body;
  const { id } = req?.params;
  const result = await BookingService.updateBookingIntoDB(id, updatedData);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Booking is updated successfully',
    data: result,
  });
});

const deleteBooking = catchAsync(async (req, res, next) => {
  const { id } = req?.params;
  const result = await BookingService.deleteBookingFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Booking deleted successfully',
    data: result,
  });
});

export const BookingController = {
  createBooking,
  getAllBookings,
  getSingleUserBookings,
  updateBooking,
  deleteBooking,
};
