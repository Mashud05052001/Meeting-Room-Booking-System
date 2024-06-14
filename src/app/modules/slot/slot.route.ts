import { Router } from 'express';
import { SlotController } from './slot.scontroller';
import { validateRequest } from '../../middleware/validateRequest';
import auth from '../../middleware/auth';
import { userRoles } from '../user/user.constant';
import { SlotValidation } from './slot.validation';

const router = Router();

router.post(
  '/',
  auth(userRoles.admin),
  validateRequest(SlotValidation.createSlotValidationSchema),
  SlotController.createSlot,
);

router.get('/availability', SlotController.getAllSlots);

export const SlotRoutes = router;
