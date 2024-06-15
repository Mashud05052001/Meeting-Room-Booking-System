import { Router } from 'express';
import { UserRoutes } from '../modules/user/user.route';
import { RoomRoutes } from '../modules/room/room.route';
import { SlotRoutes } from '../modules/slot/slot.route';
import { BookingRoutes } from '../modules/booking/booking.route';

const router = Router();

const moduleRoutes = [
  { path: '/auth', route: UserRoutes },
  { path: '/rooms', route: RoomRoutes },
  { path: '/slots', route: SlotRoutes },
  { path: '/bookings', route: BookingRoutes },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export const allRoutes = router;

// Admin    Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1hc3VkbWFoaTA1QGdtYWlsLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcxODQzMDA0OSwiZXhwIjoxNzE5Mjk0MDQ5fQ.HBWJPVfSdO-9X2Idd0qGIa4hSCRQwqlV2BJJnG8rtNM

// User    Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1hc3VkbWFoaTA1MDVAZ21haWwuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3MTg0MzAxNTAsImV4cCI6MTcxOTI5NDE1MH0.kszXZ_gHPfz8QnICX1h_Aqc7imtUqjdMSVdB4Zqn4qg
