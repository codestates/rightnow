import express, { Request, Response, Router, NextFunction } from 'express';
import userController from '../API/controller/user';
import userValidation from '../API/validation/user';

const userRouter: Router = express.Router();

export default userRouter;
