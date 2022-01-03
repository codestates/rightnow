import express, { Request, Response, Router, NextFunction } from 'express';
import userController from '../API/controller/user';
import userValidation from '../API/validation/user';

const userRouter: Router = express.Router();

const multer: any = require('multer');
const method: any = require('../method/custom');

const DIR_NAME: any = __dirname
  .split('/')
  .slice(0, __dirname.split('/').length - 1)
  .join('/');

const storage: any = multer.diskStorage({
  destination: (req: any, file: any, cb: any): void => {
    cb(null, DIR_NAME + '/image/user/'); // 파일 업로드 경로
  },
  filename: (req: any, file: any, cb: any): void => {
    cb(null, method.randomString(8, file.originalname)); //파일 이름 설정
  },
});

const upload: any = multer({
  storage,
});

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
  '/upload/image',
  upload.single('file'),
  userValidation.uploadProfileImage,
  userController.uploadProfileImage,
);

export default userRouter;
