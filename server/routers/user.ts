import express, { Request, Response, Router, NextFunction } from 'express';
import { nextTick } from 'process';
import userController from '../API/controller/user';
import userValidation from '../API/validation/user';

const userRouter: Router = express.Router();

const multer: any = require('multer');
const method: any = require('../method/custom');


// function uploadImage(req: Request, res: Response, next: NextFunction): any {
//   const DIR_NAME = __dirname + '/..';
//   const storage: any = multer.diskStorage({
//     destination: (req: any, file: any, cb: any): void => {
//       cb(null, DIR_NAME + '/image/user/'); // 파일 업로드 경로
//     },
//     filename: (req: any, file: any, cb: any): void => {
//       const regex: any = /^[a-z|A-Z|0-9|]+$/;
//       let dot =
//         file.originalname.split('.')[file.originalname.split('.').length - 1];
//       if (dot !== 'png' && dot !== 'jpg' && dot !== 'jepg') {
//         // return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
//         res
//           .status(400)
//           .send({ message: 'Only .png, .jpg and .jpeg format allowed' });
//         return;
//       }
//       let name = file.originalname;
//       if (!regex.test(name)) {
//         name = Math.random().toString(36).substring(0, 8) + '.' + dot;
//       }
//       cb(null, method.randomString(8, name)); //파일 이름 설정
//     },
//   });

//   let upload: any = multer({
//     storage,
//   });
//   upload.single('file')(req, res, next);
// }

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
