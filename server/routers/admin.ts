import express, { Request, Response, Router, NextFunction } from 'express';
import adminController from '../API/controller/admin';
import adminValidation from '../API/validation/admin';

const adminRouter: Router = express.Router();

adminRouter.get(
  '/report/user',
  adminValidation.getReportedUser,
  adminController.getReportedUser,
);
adminRouter.patch(
  '/restraint/user',
  adminValidation.restraintUser,
  adminController.restraintUser,
);

export default adminRouter;
