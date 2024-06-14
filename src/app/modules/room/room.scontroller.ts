import { catchAsync } from '../../utils/catchAsync';

const createRoom = catchAsync(async (req, res, next) => {
  console.log(req.body);
  // const result =
  // sendResponse(res, {
  //     statusCode: httpStatus.OK,
  //     success: true,
  //     message: 'Room is created successfully',
  //     data: result,
  // });
});

const getAllRooms = catchAsync(async (req, res, next) => {
  // const result =
  // sendResponse(res, {
  //     statusCode: httpStatus.OK,
  //     success: true,
  //     message: 'All Rooms are retrieved successfully',
  //     data: result,
  // });
});

const getSingleRoom = catchAsync(async (req, res, next) => {
  // const result =
  // sendResponse(res, {
  //     statusCode: httpStatus.OK,
  //     success: true,
  //     message: 'Room is retrieved successfully',
  //     data: result,
  // });
});

const updateRoom = catchAsync(async (req, res, next) => {
  // const result =
  // sendResponse(res, {
  //     statusCode: httpStatus.OK,
  //     success: true,
  //     message: 'Room is updated successfully',
  //     data: result,
  // });
});

const deleteRoom = catchAsync(async (req, res, next) => {
  // const result =
  // sendResponse(res, {
  //     statusCode: httpStatus.OK,
  //     success: true,
  //     message: 'Room is deleted successfully',
  //     data: result,
  // });
});

export const RoomController = {
  createRoom,
  getAllRooms,
  getSingleRoom,
  updateRoom,
  deleteRoom,
};
