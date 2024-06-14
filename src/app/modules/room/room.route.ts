import { Router } from 'express';
// Pleast put first alphabet smallercase carefully
import { RoomValidation } from './room.validation';
import { validateRequest } from '../../middleware/validateRequest';
import { RoomController } from './room.scontroller';

const router = Router();

router.post(
  '/rooms',
  validateRequest(RoomValidation.createRoomValidationSchema),
  RoomController.createRoom,
);

router.get('/rooms', RoomController.getAllRooms);
router.get('/rooms/:id', RoomController.getSingleRoom);
router.put('/rooms/:id', RoomController.updateRoom);
router.delete('/rooms/:id', RoomController.deleteRoom);

export const RoomRoutes = router;
