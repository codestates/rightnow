import { Request, Response } from 'express';
import { Primitive } from 'sequelize/dist/lib/utils';
import { CustomRequest } from '../../type/type';
interface RoomController {
  createRoom(req: Request, res: Response): void;
  closeRoom(req: Request, res: Response): void;
  // notifyUpdate(req: CustomRequest, res: Response): void;
  // updateRoom(req: CustomRequest, res: Response): void;
  getRoomInfo(req: CustomRequest, res: Response): void;
  getPastMeet(req: CustomRequest, res: Response): void;
}

const roomController: RoomController = {
  createRoom(req: Request, res: Response): void {
    res.status(201).send({
      message: 'ok',
    });
  },
  closeRoom(req: Request, res: Response): void {
    res.status(200).send({
      message: 'ok',
    });
  },
  getRoomInfo(req: CustomRequest, res: Response): void {
    res.status(req.sendData.status).send({
      message: req.sendData.message,
      data: req.sendData.data,
    });
  },
  getPastMeet(req: CustomRequest, res: Response): void {
    res.status(req.sendData.status).send(req.sendData);
  },
};

export default roomController;
