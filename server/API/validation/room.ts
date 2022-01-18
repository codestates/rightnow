import { Request, Response, NextFunction } from 'express';
import { CustomRequest } from '../../type/type';
import axios from 'axios';
const db: any = require('../../models/index');
const bcrypt: any = require('bcrypt');
import { Op } from 'sequelize';
const dotenv: any = require('dotenv');
dotenv.config();
interface RoomValidation {
  createRoom(data: any): Promise<any>;
  closeRoom(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  getRoomInfo(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  updateRoom(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  searchRoom(data: any): Promise<string>;
  getLocation(lat: number, lon: number): Promise<string>;
  getPastMeet(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
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
    console.log(data);
    let room = await db.Room.create(data);
    return room.dataValues;
  },

  /*
    모임 룸 닫기 - 생성자 요청으로 방 닫기
  */
  async closeRoom(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {},
  /*
    모임룸 정보
  */
  async getRoomInfo(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    let { room_id, email } = req.body;
    try {
      let participant = await db.Participant.findOne({
        where: {
          user_email: email,
          room_id,
        },
      });
      console.log(participant.dataValues);
      let [date, time] = participant.dataValues.enter_date.split(' ');
      let [Y, M, D] = date.split('-');
      let [h, m, s] = time.split(':');
      console.log(`${Y} ${M} ${D} ${h} ${m} ${s}`);
      let messageDate = new Date(
        Number(Y),
        Number(M) - 1,
        Number(D),
        Number(h),
        Number(m),
        Number(s),
      );
      console.log(messageDate);
      let room = await db.Room.findOne({
        include: [
          {
            model: db.Participant,
            include: {
              model: db.User,
              attributes: {
                exclude: ['is_block', 'block_date', 'createdAt', 'updatedAt'],
              },
            },
          },
          {
            model: db.Message,
            include: {
              model: db.User,
              attributes: {
                exclude: ['is_block', 'block_date', 'createdAt', 'updatedAt'],
              },
            },
            where: {
              write_date: {
                [Op.gte]: messageDate,
              },
            },
            required: false,
          },
        ],
        order: [[db.Message, 'write_date', 'ASC']],
        where: { id: room_id },
      });
      if (room === null)
        req.sendData = { data: 'N/A', message: 'room not exist', status: 409 };
      else {
        room.dataValues.Messages = room.dataValues.Messages.map((item: any) => {
          let temp = item.dataValues;
          temp.write_date = temp.write_date
            .split(':')
            .slice(0, temp.write_date.split(':').length - 1)
            .join(':');
          return temp;
        });
        req.sendData = { data: room.dataValues, message: 'ok', status: 200 };
      }
      next();
    } catch (e) {
      console.log(e);
      req.sendData = {
        message: 'get Room Info: invalid access',
        status: 200,
        data: e,
      };
      next();
    }
  },
  /*
    모임 업데이트
  */
  async updateRoom(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {},

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
        {
          close_date: { [Op.gt]: new Date() },
        },
      ],
      include: [
        {
          model: db.Participant,
          attributes: { include: ['id'] },
        },
      ],
    });

    //받아온 rooms 를 반복적으로 돌며 서칭
    for (let room of rooms) {
      let roomNum = room.dataValues.allow_num;
      // let findNum = await db.Participant.findOne({
      //   attributes: [[db.sequelize.fn('COUNT', 'id'), 'num_count']],
      //   group: ['room_id'],
      //   where: {
      //     room_id: room.dataValues.id,
      //   },
      // });
      let findNum = room.dataValues.Participants.length;
      console.log('roomNum: ' + roomNum);
      console.log('findNum: ' + findNum);
      if (
        data.type === 'ALONE'
          ? roomNum - findNum >= 1
          : roomNum - findNum >= data.email_list.length + 1
      )
        return room.dataValues.id;
    }

    return 'fail';
  },
  // lat:y lon:x
  async getLocation(lat: number, lon: number): Promise<string> {
    let location: string = '';
    let url = `https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${lon}&y=${lat}`;
    let auth = `KakaoAK ${process.env.KAKAO_AUTH || ''}`;
    await axios
      .get(url, {
        headers: { Authorization: auth },
      })
      .then((result: any) => {
        let data = result.data;
        location = data.documents[0].address_name;
      })
      .catch((err) => {
        location = 'out of range';
      });

    return location;
  },

  async getPastMeet(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    let body: any = req.body;
    let send: any = null;
    try {
      let pastRooms = await db.Room.findAll({
        where: [
          {
            [`$Participants.user_email$`]: body.email,
          },
          {
            close_date: {
              [Op.lt]: new Date(),
            },
          },
        ],
        include: { model: db.Participant },
      });

      for (let i = 0; i < pastRooms.length; i++) {
        let participants = await db.Participant.findAll({
          where: { room_id: pastRooms[i].dataValues.id },
        });
        pastRooms[i].dataValues.Participants = participants;
      }
      if (pastRooms.length === 0) {
        send = {
          status: 200,
          message: 'N/A',
        };
      } else {
        send = {
          status: 200,
          message: 'ok',
          data: pastRooms,
        };
      }
      req.sendData = send;
      next();
    } catch (e) {
      res.status(400).send({
        message: 'invalid access',
        code: e,
      });
    }
  },
};

export default roomValidation;
