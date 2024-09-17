import { NextFunction, Request, Response, Router } from 'express';
// Pleast put first alphabet smallercase carefully
import { UserValidation } from './user.validation';
import { UserController } from './user.scontroller';
import { validateRequest } from '../../middleware/validateRequest';
import auth from '../../middleware/auth';

const router = Router();

router.get(
  '/get-user',
  (req: Request, res: Response, next: NextFunction) => {
    req.body = req.query;
    next();
  },
  auth('admin', 'super-admin', 'user'),
  validateRequest(UserValidation.forgetPasswordValidationSchema),
  UserController.getUserInfos,
);

router.post(
  '/update-user',
  auth('admin', 'super-admin', 'user'),
  validateRequest(UserValidation.updateUserValidationSchema),
  UserController.updateUserInfos,
);

router.get(
  '/all-users',
  auth('admin', 'super-admin'),
  UserController.getAllUsers,
);

router.post(
  '/change-role',
  validateRequest(UserValidation.updateUserRoleValidationSchema),
  auth('admin', 'super-admin'),
  UserController.updateUserRole,
);

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
  auth('admin', 'user', 'super-admin'),
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

router.post(
  '/send-contact-email',
  validateRequest(UserValidation.sendEmailValidationSchem),
  UserController.sendContactEmail,
);

export const UserRoutes = router;
