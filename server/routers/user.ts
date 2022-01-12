import express, { Request, Response, Router, NextFunction } from 'express';
import { nextTick } from 'process';
import userController from '../API/controller/user';
import userValidation from '../API/validation/user';

const userRouter: Router = express.Router();

const multer: any = require('multer');
const method: any = require('../method/custom');

userRouter.post('/login', userValidation.login, userController.login);
userRouter.post('/logout', userValidation.logout, userController.logout);
userRouter.post('/signup', userValidation.signup, userController.signup);
userRouter.post('/signout', userValidation.signout, userController.signout);
userRouter.post(
  '/email/auth',
  userValidation.emailAuth,
  userController.emailAuth,
);
userRouter.get('/info', userValidation.getUserInfo, userController.getUserInfo);
userRouter.patch(
  '/update',
  userValidation.updateUserInfo,
  userController.updateUserInfo,
);
userRouter.patch(
  '/update/password',
  userValidation.changePassword,
  userController.changePassword,
);
userRouter.put(
  '/upload/image/:email',
  userValidation.uploadImage,
  userValidation.uploadProfileImage,
  userController.uploadProfileImage,
);
userRouter.post(
  '/report',
  userValidation.reportUser,
  userController.reportUser,
);

export default userRouter;
