import { Request, Response } from 'express';
interface RoomController {
  createRoom(req: Request, res: Response): void;
}

const roomController: RoomController = {
  createRoom(req: Request, res: Response): void {
    res.status(201).send({
      message: 'ok',
    });
  },
};

export default roomController;
