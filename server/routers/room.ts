import express, { Request, Response, Router, NextFunction } from 'express';
import roomController from '../API/controller/room';
import roomValidation from '../API/validation/room';

const roomRouter: Router = express.Router();

roomRouter.post(
  '/create',
  roomValidation.createRoom,
  roomController.createRoom
);

export default roomRouter;
