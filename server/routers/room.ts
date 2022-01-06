import express, { Request, Response, Router, NextFunction } from 'express';
import roomController from '../API/controller/room';
import roomValidation from '../API/validation/room';

const roomRouter: Router = express.Router();

roomRouter.post(
  '/create',
  roomValidation.createRoom,
  roomController.createRoom,
);
roomRouter.post('/delete', roomValidation.closeRoom, roomController.closeRoom);
roomRouter.post('/get', roomValidation.getRoomInfo, roomController.getRoomInfo);
roomRouter.post(
  '/get/past',
  roomValidation.getPastMeet,
  roomController.getPastMeet,
);

export default roomRouter;
