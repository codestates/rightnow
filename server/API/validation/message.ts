import { Request, Response } from 'express';
import { CustomRequest } from '../../type/type';
const db: any = require('../../models/index');
interface MessageValidation {
  insertMessage(
    room_id: string,
    content: string,
    user_email: string,
    message_type?: string,
  ): Promise<any>;
  updateMessage(id: number, content: string): Promise<any>;
}

const messageValidation: MessageValidation = {
  async insertMessage(
    room_id: string,
    content: string,
    user_email: string,
    message_type: string = 'TEXT',
  ): Promise<any> {
    let insert: any = await db.Message.create({
      room_id,
      content,
      user_email,
      message_type,
      write_date: new Date(),
    });
    return insert.dataValues;
  },
  async updateMessage(id: number, content: string): Promise<any> {
    let update: any = await db.Message.update(
      { content, is_update: 'Y' },
      { where: { id } },
    );
    let getMessage = await db.Message.findOne({ where: { id } });
    getMessage.dataValues.write_date = getMessage.dataValues.write_date
      .split(':')
      .slice(0, getMessage.dataValues.write_date.split(':').length - 1)
      .join(':');
    return getMessage.dataValues;
  },
};

export default messageValidation;
