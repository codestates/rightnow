import { Request, Response, NextFunction } from 'express';
import { nextTick } from 'process';
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
  notifyUpdate(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  updateRoom(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}

const roomValidation: RoomValidation = {
  /*
    모임 룸 생성 - req body 데이터 받아서 생성
  */
  async createRoom(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    // const transaction: any = await db.sequelize.transaction();
    // let body: any = req.body;
    // if (
    //   !body.id ||
    //   !body.title ||
    //   !body.allow_num ||
    //   !body.category_id ||
    //   !body.lon ||
    //   !body.lat
    // ) {
    //   res.status(400).send({
    //     message: 'required data not received',
    //   });
    //   return;
    // }
    // let room = await db.Room.findOne({ where: { id: body.id } });
    // if (room) {
    //   res.status(200).send({
    //     message: 'room id aleady exists',
    //   });
    //   return;
    // }
    // if (body.is_private === 'Y')
    //   body.password = await bcrypt.hashSync(body.password, 10);
    // await db.Room.create(body, { transaction });
    // await db.Participant.create(
    //   {
    //     room_id: body.id,
    //     user_email: body.user_email,
    //     role: 'HOST',
    //   },
    //   { transaction }
    // );
    // await transaction.commit();
    // next();
  },

  /*
    모임 룸 닫기 - 생성자 요청으로 방 닫기
  */
  async closeRoom(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    // let id: string = req.body.room_id;
    // let find: any = await db.Room.findOne({
    //   attributes: {
    //     exclude: [
    //       /*'UserId', 'CategoryId'*/
    //     ],
    //   },
    //   where: { id },
    // });
    // if (!find) {
    //   res.status(409).send({
    //     message: 'roomId not exist',
    //   });
    //   return;
    // }
    // await db.Room.update({ is_close: 'Y' }, { where: { id } });
    // next();
  },
  /*
    모임 공지 생성
  */
  async notifyUpdate(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    // let body = req.body;
    // if (!body.notify || body.notify === '') {
    //   req.sendData = { message: 'notification not received', status: 400 };
    //   next();
    //   return;
    // }
    // let find = await db.Room.findOne({ where: { id: body.id } });
    // if (!find) {
    //   req.sendData = { message: 'room not exist', status: 401 };
    //   next();
    //   return;
    // }
    // await db.Room.update({ notify: body.notify }, { where: { id: body.id } });
    // req.sendData = { message: 'ok', status: 200 };
    // next();
  },
  /*
    모임 업데이트
  */
  async updateRoom(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    // let body: any = req.body;
    // let id: string = body.id;
    // let count: any = await db.Participant.findOne({
    //   attributes: [[db.sequelize.fn('COUNT', 'id'), 'num_count']],
    //   group: ['room_id'],
    //   where: { room_id: body.id },
    // });
    // if (count && count.dataValues.num_count > body.allow_num) {
    //   req.sendData = { message: 'number range exit', status: 409 };
    //   next();
    //   return;
    // }
    // if (body.is_private === 'Y')
    //   body.password = await bcrypt.hashSync(body.password, 10);
    // delete body.id;
    // await db.Room.update(body, { where: { id } });
    // req.sendData = { message: 'ok', status: 200 };
    // next();
  },
};

export default roomValidation;
