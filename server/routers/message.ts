import express, { Request, Response, Router, NextFunction } from 'express';
import messageController from '../API/controller/message';
import messageValidation from '../API/validation/message';

const messageRouter: Router = express.Router();

messageRouter.get(
  '/image',
  messageValidation.uploadImage,
  messageController.uploadImage,
);
export default messageRouter;
