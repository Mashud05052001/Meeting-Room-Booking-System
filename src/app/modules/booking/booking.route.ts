import { Router } from 'express';
import { BookingValidation } from './booking.validation';
import { BookingController } from './booking.scontroller';
import { validateRequest } from '../../middleware/validateRequest';
import { userRoles } from '../user/user.constant';
import auth from '../../middleware/auth';

const router = Router();

router.post(
  '/',
  auth(userRoles.user),
  validateRequest(BookingValidation.createBookingValidationSchema),
  BookingController.createBooking,
);

router.get(
  '/',
  auth(userRoles.admin, userRoles?.superAdmin),
  BookingController.getAllBookings,
);
router.get(
  '/my-bookings',
  auth(userRoles.user),
  BookingController.getSingleUserBookings,
);
router.put(
  '/:id',
  auth(userRoles.admin),
  validateRequest(BookingValidation.updateBookingValidationSchema),
  BookingController.updateBooking,
);
router.delete('/:id', auth(userRoles.admin), BookingController.deleteBooking);

router.patch(
  '/canceled/:id',
  auth(userRoles?.user),
  BookingController.canceledBookingWhilePaymentCanceled,
);

export const BookingRoutes = router;
