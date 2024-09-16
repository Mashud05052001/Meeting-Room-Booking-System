import { Router } from 'express';
import auth from '../middleware/auth';
import { userRoles } from '../modules/user/user.constant';
import { PaymentService } from './payment.service';
import { validateRequest } from '../middleware/validateRequest';
import bookingValidationSchema from './payment.validation';

const router = Router();

// aamarPay
router.post(
  '/ap',
  validateRequest(bookingValidationSchema),
  auth(userRoles.user),
  PaymentService.createPayment,
);

router.post('/success', PaymentService.confirmationPayment);
router.post('/failed', PaymentService.confirmationPayment);

export const PaymentRoutes = router;
