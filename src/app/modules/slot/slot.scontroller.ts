import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import { SlotService } from './slot.service';
import sendResponse from '../../utils/sendResponse';

const createSlot = catchAsync(async (req, res, next) => {
  const data = req?.body;
  const result = await SlotService.createSlotIntoDB(data);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Slots created successfully',
    data: result,
  });
});

const getAllSlots = catchAsync(async (req, res, next) => {
  const query = req?.query;
  const result = await SlotService.getAllSlotsFromDB(query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All Slots are retrieved successfully',
    data: result,
  });
});

export const SlotController = {
  createSlot,
  getAllSlots,
};
