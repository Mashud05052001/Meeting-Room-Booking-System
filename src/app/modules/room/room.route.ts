import { Router } from 'express';
// Pleast put first alphabet smallercase carefully
import { RoomValidation } from './room.validation';
import { validateRequest } from '../../middleware/validateRequest';
import { RoomController } from './room.scontroller';

const router = Router();

router.post(
  '/',
  validateRequest(RoomValidation.createRoomValidationSchema),
  RoomController.createRoom,
);

router.get('/', RoomController.getAllRooms);
router.get('/:id', RoomController.getSingleRoom);
router.put(
  '/:id',
  validateRequest(RoomValidation.updateRoomValidationSchema),
  RoomController.updateRoom,
);
router.delete('/:id', RoomController.deleteRoom);

export const RoomRoutes = router;
