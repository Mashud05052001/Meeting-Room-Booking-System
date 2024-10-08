import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { TSlot } from './slot.interface';

export const checkValidDate = (payload: string) => {
  const yearRegex = /^(19|20)\d\d-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
  const isValidFormat = yearRegex.test(payload);
  if (!isValidFormat) return false;

  const providedDate = payload.split('-');

  const currentFullDate = new Date().toISOString();
  const providedFullDate = `${providedDate[0]}-${providedDate[1]}-${providedDate[2]}T${currentFullDate.split('T')[1]}`;
  if (new Date(currentFullDate) > new Date(providedFullDate)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Slots creating date cannot be previous of current date ${currentFullDate.split('T')[0]}`,
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

export const slotsGenerator = (payload: TSlot) => {
  const createdDataWithDynamicSlots: TSlot[] = [];
  const slotDuration = payload?.slotDuration;
  const { startTime, endTime, ...otherData } = payload;

  const startTimeInMinute =
    Number(startTime.split(':')[0]) * 60 + Number(startTime.split(':')[1]);
  const endTimeInMinute =
    Number(endTime.split(':')[0]) * 60 + Number(endTime.split(':')[1]);

  const noOfTotalSlots = Math.ceil(
    (endTimeInMinute - startTimeInMinute) / slotDuration,
  );

  for (let i = 0; i < noOfTotalSlots; i++) {
    const startTime = timeGenerator(startTimeInMinute + i * slotDuration);
    let endTime: string;
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
