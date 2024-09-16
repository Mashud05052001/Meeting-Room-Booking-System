import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import { SlotService } from './slot.service';
import sendResponse from '../../utils/sendResponse';

const createSlot = catchAsync(async (req, res) => {
  const data = req?.body;
  const result = await SlotService.createSlotIntoDB(data);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Slots created successfully',
    data: result,
  });
});

const getAllSlots = catchAsync(async (req, res) => {
  const query = req?.query;
  const result = await SlotService.getAllSlotsFromDB(query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All Slots are retrieved successfully',
    data: result,
  });
});
const getSingleSlot = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await SlotService.getSingleSlotFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Slot is retrieved successfully',
    data: result,
  });
});
const getMultipleSlots = catchAsync(async (req, res) => {
  const { slots } = req.body;
  const result = await SlotService.getMultipleSlotsFromDB(slots as string[]);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Slots are retrieved successfully',
    data: result,
  });
});

const deleteSlot = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await SlotService.deleteSlotFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Slot deleted successfully',
    data: result,
  });
});

const updateSlot = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data = req?.body;
  const result = await SlotService.updateSlotIntoDB(id, data);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Slots updated successfully',
    data: result,
  });
});

const getAllDateOfASlot = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await SlotService.getAllDateOfASlot(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All dates recovered successfully',
    data: result,
  });
});
export const SlotController = {
  createSlot,
  getAllSlots,
  getSingleSlot,
  getMultipleSlots,
  deleteSlot,
  updateSlot,
  getAllDateOfASlot,
};
