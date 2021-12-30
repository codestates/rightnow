import express, { Request, Response, Router, NextFunction } from 'express';
import adminController from '../API/controller/admin';
import adminValidation from '../API/validation/admin';

const adminRouter: Router = express.Router();

adminRouter.post(
  '/get/user',
  adminValidation.test,
  adminController.getReportedUser
);

export default adminRouter;
