import { Model } from 'mongoose';

export type TRoom = {
  name: string;
  roomNo: number;
  floorNo: number;
  capacity: number;
  pricePerSlot: number;
  amenities: string[];
  isDeleted?: boolean;
};

export interface TRoomModel extends Model<TRoom> {
  findRoom(id: string): Promise<TRoom>;
}
