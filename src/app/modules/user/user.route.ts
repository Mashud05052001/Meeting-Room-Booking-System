import { Router } from 'express';
// Pleast put first alphabet smallercase carefully
import { UserValidation } from './user.validation';
import { UserController } from './user.scontroller';
import { validateRequest } from '../../middleware/validateRequest';

const router = Router();

router.post(
  '/signup',
  validateRequest(UserValidation.signupValidationSchema),
  UserController.signupUser,
);

router.post(
  '/login',
  validateRequest(UserValidation.loginValidationSchema),
  UserController.loginUser,
);

export const UserRoutes = router;
