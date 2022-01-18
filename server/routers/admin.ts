import express, { Request, Response, Router, NextFunction } from 'express';
import adminController from '../API/controller/admin';
import adminValidation from '../API/validation/admin';

const adminRouter: Router = express.Router();
adminRouter.get(
  '/user',
  adminValidation.getAllUser,
  adminController.getAllUser,
);
adminRouter.get(
  '/report/user',
  adminValidation.getReportedUser,
  adminController.getReportedUser,
);
adminRouter.post(
  '/block/user',
  adminValidation.blockUser,
  adminController.blockUser,
);

export default adminRouter;
