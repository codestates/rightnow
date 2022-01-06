import { NextFunction, Request, Response } from 'express';
import { CustomRequest } from '../../type/type';
import { Op } from 'sequelize';
import axios from 'axios';
import { nextTick } from 'process';
const db: any = require('../../models/index');

interface Participant {
  user_email: string;
  room_id: string;
  lon: number;
  lat: number;
}

interface ParticipantValidation {
  checkParticipant(
    email: string,
    type: string,
    email_list: Array<string>,
  ): Promise<any>;
  enterRoom(
    email: string,
    room_id: string,
    type: string,
    lon: number,
    lat: number,
    email_list?: Array<string>,
  ): Promise<any>;
  leaveRoom(email: string, room_id: string): Promise<any>;
  getLocationForKakao(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ): Promise<any>;
}

const participantValidation: ParticipantValidation = {
  /*
    데이터 형식
        email : 본인의 이메일 
        type : 혼자인지 그룹인지 'ALONE','GROUP'
        email_list : 그룹인 경우 같이 서칭할 이메일 리스트
  */
  async checkParticipant(
    email: string,
    type: string,
    email_list: Array<string>,
  ): Promise<any> {
    let find = await db.Participant.findOne({
      include: {
        model: db.Room,
        attributes: { include: ['id', 'close_date'] },
      },
      where: [
        { user_email: email },
        {
          [`$Room.close_date$`]: {
            [Op.gt]: new Date(),
          },
        },
      ],
    });
    if (type === 'ALONE') {
      return find
        ? { room_id: find.dataValues.room_id, message: 'exist' }
        : { message: 'no exist' };
    } else {
      let finds = await db.Participant.findAll({
        where: { user_email: { [Op.in]: [...email_list, email] } },
      });
      return 0 >= finds.length
        ? { message: 'no exist' }
        : find
        ? { message: 'exist', room_id: find.dataValues.room_id }
        : { message: 'someone exist' };
    }
  },
  /*
    룸 서칭이 완료되었을 시 룸 리스트
  */
  async enterRoom(
    email: string,
    room_id: string,
    type: string,
    lon: number,
    lat: number,
    user_list?: Array<string> | any,
  ): Promise<any> {
    let participant = await db.Participant.findOne({
      where: [{ room_id }, { user_email: email }],
    });
    if (participant) return 'user aleady attend this room';
    if (type === 'ALONE') {
      await db.Participant.create({ user_email: email, room_id, lon, lat });
    } else if (type === 'GROUP') {
      let inserts: Array<Participant> = user_list.map((item: string) => {
        return {
          user_email: item,
          room_id,
          lon,
          lat,
        };
      });
      inserts.push({ user_email: email, room_id, lon, lat });
      await db.Participant.bulkCreate(inserts);
    } else if (type === 'TEMP') {
      let inserts = user_list.map((item: any): any => {
        return {
          user_email: item.email,
          room_id,
          lon: item.lon,
          lat: item.lat,
        };
      });
      inserts.push({ user_email: email, room_id, lon, lat });
      await db.Participant.bulkCreate(inserts);
    }
    let room = db.Room.findOne({ where: { id: room_id } });
    return room.dataValues;
  },
  async leaveRoom(email: string, room_id: string): Promise<any> {
    let transaction: any = await db.sequelize.transaction();
    let user: any = await db.User.findOne({ where: { email } });
    let send: any = null;
    await db.Participant.delete(
      {
        where: [{ room_id }, { user_email: email }],
      },
      { transaction },
    );
    //임시계정일 경우 삭제
    if (user.dataValues.role === 'TEMP')
      await db.User.delete({ where: { email } }, { transaction });

    let participants = await db.Participant.findAll({ where: { room_id } });
    if (participants.length === 0) {
      let room = await db.Participant.delete(
        { where: { id: room_id } },
        { transaction },
      );
      send = {
        message: 'room delete',
        room_id,
      };
    } else {
      send = {
        message: 'ok',
      };
    }

    transaction.commit();

    return send;
  },
  async getLocationForKakao(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ): Promise<any> {
    let location: string = '';
    let query = req.query;
    let url = `https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${query.lon}&y=${query.lat}`;
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
    let send: any = null;

    if (location === 'out of range') {
      send = {
        status: 400,
        code: location,
      };
    } else {
      send = {
        status: 200,
        data: location,
      };
    }
    req.sendData = send;
    next();
  },
};

export default participantValidation;
