import { Request, Response } from 'express';
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
    email_list: Array<string>
  ): Promise<boolean>;
  enterRoom(
    email: string,
    room_id: string,
    type: string,
    lon: number,
    lat: number,
    email_list?: Array<string>
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
    email_list: Array<string>
  ): Promise<boolean> {
    if (type === 'ALONE') {
      let find = await db.Participant.findOne({ where: { user_email: email } });
      return find ? false : true;
    }
    let find = await db.Participant.findAll({
      where: { user_email: { in: [...email_list, email] } },
    });
    return 0 >= find.length ? true : false;
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
    user_list?: Array<string>
  ): Promise<any> {
    if (type === 'ALONE') {
      await db.Participant.create({ user_email: email, room_id, lon, lat });
    } else {
      let inserts: Array<Participant> = user_list.map((item) => {
        return {
          user_email: item,
          room_id,
          lon,
          lat,
        };
      });
      inserts.push({ user_email: email, room_id, lon, lat });
      await db.Participaint.bulkCreate(inserts);
    }
    let room = db.Room.findOne({ where: { id: room_id } });
    return room.dataValues;
  },
};

export default participantValidation;
