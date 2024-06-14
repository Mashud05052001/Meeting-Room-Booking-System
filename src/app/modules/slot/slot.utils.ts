import httpStatus from 'http-status';
import AppError from '../../errors/ArrError';
import { TSlot } from './slot.interface';

export const checkValidDate = (payload: string) => {
  const date = new Date();
  const currentYear = date.getFullYear(),
    currentDate = date.getDate(),
    currentMonth = date.getMonth() + 1,
    currentFullDate = `${currentYear}-${currentMonth}-${currentDate}`;
  const providedDate = payload.split('-');
  if (
    Number(providedDate[0]) < currentYear ||
    Number(providedDate[1]) < currentMonth ||
    Number(providedDate[2]) < currentDate
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Slots creating date cannot be previous of current date ${currentFullDate}`,
    );
  }
  return true;
};

export const checkValidTime = (payload: string) => {
  const regex = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
  return regex.test(payload);
};

export const checkStartTimeIsBeforeOrNotEndTime = (
  payload: Record<string, unknown>,
) => {
  const { startTime, endTime } = payload;
  // 2024-06-14T21:08:55.254Z
  const startDate = `2000-01-01T${startTime}`,
    endDate = `2000-01-01T${endTime}`;
  return endDate > startDate;
};

export const timeGenerator = (payload: number) => {
  const hour = Math.floor(payload / 60);
  const minute = payload - hour * 60;
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
};

export const slotsGenerator = (payload: TSlot, slotDuration: number) => {
  let createdDataWithDynamicSlots: TSlot[] = [];
  const { startTime, endTime, ...otherData } = payload;

  const startTimeInMinute =
    Number(startTime.split(':')[0]) * 60 + Number(startTime.split(':')[1]);
  const endTimeInMinute =
    Number(endTime.split(':')[0]) * 60 + Number(endTime.split(':')[1]);

  const noOfTotalSlots = Math.ceil(
    (endTimeInMinute - startTimeInMinute) / slotDuration,
  );

  for (let i = 0; i < noOfTotalSlots; i++) {
    let startTime: string, endTime: string;
    startTime = timeGenerator(startTimeInMinute + i * slotDuration);
    if (i !== noOfTotalSlots - 1) {
      endTime = timeGenerator(startTimeInMinute + (i + 1) * slotDuration);
    } else {
      endTime = timeGenerator(endTimeInMinute);
    }
    const data: TSlot = {
      ...otherData,
      startTime,
      endTime,
    };
    createdDataWithDynamicSlots.push(data);
  }
  return createdDataWithDynamicSlots;
};
