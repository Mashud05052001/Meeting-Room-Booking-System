import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { RoomService } from './room.service';

const createRoom = catchAsync(async (req, res, next) => {
  const data = req?.body;
  const result = await RoomService.createRoomIntoDB(data);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Room added successfully',
    data: result,
  });
});

const getAllRooms = catchAsync(async (req, res, next) => {
  const result = await RoomService.getAllRoomsFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Rooms retrieved successfully',
    data: result,
  });
});

const getSingleRoom = catchAsync(async (req, res, next) => {
  const { id } = req?.params;
  const result = await RoomService.getSingleRoomFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Room retrieved successfully',
    data: result,
  });
});

const updateRoom = catchAsync(async (req, res, next) => {
  const data = req?.body;
  const { id } = req?.params;
  const result = await RoomService.updateRoomIntoDB(id, data);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Room updated successfully',
    data: result,
  });
});

const deleteRoom = catchAsync(async (req, res, next) => {
  const { id } = req?.params;
  const result = await RoomService.deleteRoomFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Room deleted successfully',
    data: result,
  });
});

export const RoomController = {
  createRoom,
  getAllRooms,
  getSingleRoom,
  updateRoom,
  deleteRoom,
};
