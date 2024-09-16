import { Router } from 'express';
import { SlotController } from './slot.scontroller';
import { validateRequest } from '../../middleware/validateRequest';
import auth from '../../middleware/auth';
import { userRoles } from '../user/user.constant';
import { SlotValidation } from './slot.validation';

const router = Router();

router.post(
  '/',
  auth(userRoles.admin, userRoles.superAdmin),
  validateRequest(SlotValidation.createSlotValidationSchema),
  SlotController.createSlot,
);

router.get(
  '/',
  auth(userRoles.admin, userRoles.superAdmin, userRoles.user),
  SlotController.getAllSlots,
);

router.post(
  '/multiple',
  validateRequest(SlotValidation.getMultipleSlotsValidationSchema),
  auth(userRoles.admin, userRoles.superAdmin, userRoles.user),
  SlotController.getMultipleSlots,
);

router.get(
  '/:id',
  auth(userRoles.admin, userRoles.superAdmin, userRoles.user),
  SlotController.getSingleSlot,
);

router.delete(
  '/:id',
  auth(userRoles.admin, userRoles.superAdmin),
  SlotController.deleteSlot,
);

router.patch(
  '/:id',
  validateRequest(SlotValidation.updateSlotValidationSchema),
  auth(userRoles.admin, userRoles.superAdmin),
  SlotController.updateSlot,
);

router.get(
  '/dates/:id',
  // auth(userRoles.admin, userRoles.superAdmin),
  SlotController.getAllDateOfASlot,
);

export const SlotRoutes = router;
