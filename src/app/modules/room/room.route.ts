import { Router } from 'express';
// Pleast put first alphabet smallercase carefully
import { RoomValidation } from './room.validation';
import { validateRequest } from '../../middleware/validateRequest';
import { RoomController } from './room.scontroller';
import auth from '../../middleware/auth';
import { userRoles } from '../user/user.constant';

const router = Router();

router.post(
  '/',
  auth(userRoles.admin),
  validateRequest(RoomValidation.createRoomValidationSchema),
  RoomController.createRoom,
);

router.get('/', RoomController.getAllRooms);
router.get('/:id', RoomController.getSingleRoom);
router.put(
  '/:id',
  auth(userRoles.admin),
  validateRequest(RoomValidation.updateRoomValidationSchema),
  RoomController.updateRoom,
);
router.delete('/:id', auth(userRoles.admin), RoomController.deleteRoom);

export const RoomRoutes = router;
