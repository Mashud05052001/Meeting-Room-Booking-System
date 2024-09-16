import { Router } from 'express';
import { UserRoutes } from '../modules/user/user.route';
import { RoomRoutes } from '../modules/room/room.route';
import { SlotRoutes } from '../modules/slot/slot.route';
import { BookingRoutes } from '../modules/booking/booking.route';
import { PaymentRoutes } from '../payment/payment.route';

const router = Router();

const moduleRoutes = [
  { path: '/auth', route: UserRoutes },
  { path: '/rooms', route: RoomRoutes },
  { path: '/slots', route: SlotRoutes },
  { path: '/bookings', route: BookingRoutes },
  { path: '/payment', route: PaymentRoutes },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export const allRoutes = router;
