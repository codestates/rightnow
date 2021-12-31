import { Request, Response, NextFunction } from 'express';
import { CustomRequest } from '../../type/type';
const db: any = require('../../models/index');
const bcrypt: any = require('bcrypt');

interface RoomValidation {
  createRoom(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  closeRoom(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}

const roomValidation: RoomValidation = {
  async createRoom(req: CustomRequest, res: Response, next: NextFunction) {
    //const transaction: any = await db.sequelize.transaction();
    let body: any = req.body;
    if (
      !body.id ||
      !body.title ||
      !body.allow_num ||
      !body.category_id ||
      !body.lon ||
      !body.lat
    ) {
      res.status(400).send({
        message: 'required data not received',
      });
      return;
    }

    if (body.is_private === 'Y')
      body.password = await bcrypt.hashSync(body.password, 10);
    await db.Room.create(body);
    next();
  },
  async closeRoom(req: CustomRequest, res: Response, next: NextFunction) {
    let id: string = req.body.room_id;
    let find: any = await db.Room.findOne({
      attributes: {
        exclude: [
          /*'UserId', 'CategoryId'*/
        ],
      },
      where: { id },
    });
    if (!find) {
      res.status(409).send({
        message: 'roomId not exist',
      });
      return;
    }
    await db.Room.update({ is_close: 'Y' }, { where: { id } });
    next();
  },
};

export default roomValidation;
