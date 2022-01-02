import express, { Request, Response, Router, NextFunction } from 'express';
import roomController from '../API/controller/room';
import roomValidation from '../API/validation/room';

const roomRouter: Router = express.Router();

roomRouter.post(
  '/create',
  roomValidation.createRoom,
  roomController.createRoom
);
roomRouter.post('/delete', roomValidation.closeRoom, roomController.closeRoom);
// roomRouter.patch(
//   '/update/notify',
//   roomValidation.notifyUpdate,
//   roomController.notifyUpdate
// );
// roomRouter.put('/update', roomValidation.updateRoom, roomController.updateRoom);

export default roomRouter;
