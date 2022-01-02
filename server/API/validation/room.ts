import { Request, Response, NextFunction } from 'express';
import { CustomRequest } from '../../type/type';
const db: any = require('../../models/index');
const bcrypt: any = require('bcrypt');

interface RoomValidation {
  createRoom(data: any): Promise<any>;
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
  searchRoom(data: any): Promise<string>;
}

const roomValidation: RoomValidation = {
  /*
    모임 룸 생성 - req body 데이터 받아서 생성
    location,
    category_id,
    
  */
  async createRoom(data: any): Promise<any> {
    let category = await db.Category.findOne({
      where: { id: data.category_id },
    });
    data.allow_num = category.dataValues.user_num;
    let room = await db.Room.create(data);
    return room.dataValues;
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

  /*
    데이터 형식
    data = {
      category_id :number,
      location :string,
      email: string,
      type: string, // 'ALONE' or 'GROUP'
      email_list: Array<string> // only group
    }
  */
  async searchRoom(data: any): Promise<string> {
    let rooms = await db.Room.findAll({
      where: [
        {
          category_id: data.category_id,
        },
        {
          location: data.location,
        },
      ],
    });

    //받아온 rooms 를 반복적으로 돌며 서칭
    for (let room of rooms) {
      let roomNum = room.dataValues.allow_num;
      let findNum = await db.Participant.findOne({
        attributes: [[db.sequelize.fn('COUNT', 'id'), 'num_count']],
        group: ['room_id'],
        where: {
          room_id: room.dataValues.id,
        },
      });
      if (
        data.type === 'ALONE'
          ? roomNum - findNum.dataValues.num_count >= 1
          : roomNum - findNum.dataValues.num_count >= data.email_list.length + 1
      )
        return room.dataValues.id;
    }

    return 'fail';
  },
};

export default roomValidation;
