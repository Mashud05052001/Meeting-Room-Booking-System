import { Router } from 'express';
// Pleast put first alphabet smallercase carefully
import { UserValidation } from './user.validation';
import { UserController } from './user.scontroller';
import { validateRequest } from '../../middleware/validateRequest';
import auth from '../../middleware/auth';

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

router.post(
  '/change-password',
  validateRequest(UserValidation.changePasswordValidationSchema),
  auth('admin', 'user'),
  UserController.changePassword,
);

router.post(
  '/generate-access-token',
  validateRequest(UserValidation.generateAccessTokenValidationSchema),
  UserController.generateAccessTokenFromRefreshToken,
);

router.post(
  '/forget-password',
  validateRequest(UserValidation.forgetPasswordValidationSchema),
  UserController.forgetPassword,
);

router.post(
  '/reset-password',
  validateRequest(UserValidation.resetPasswordValidationSchema),
  UserController.resetPassword,
);

export const UserRoutes = router;
