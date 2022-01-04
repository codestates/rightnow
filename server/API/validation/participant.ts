import { Request, Response } from 'express';
import { Op } from 'sequelize';
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
};

export default participantValidation;
