import { Request, Response, NextFunction } from 'express';
import { CustomRequest } from '../../type/type';
const dotenv: any = require('dotenv');
const db: any = require('../../models/index');
const multer: any = require('multer');
const multerS3: any = require('multer-s3');
const aws: any = require('aws-sdk');
aws.config.loadFromPath(__dirname + '/../../aws-config.json');
const s3 = new aws.S3();
const method: any = require('../../method/custom');
dotenv.config();
interface MessageValidation {
  insertMessage(
    room_id: string,
    content: string,
    user_email: string,
    message_type?: string,
  ): Promise<any>;
  updateMessage(id: number, content: string): Promise<any>;
  uploadImage(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
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
  async uploadImage(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    let imgUrl = '';
    const storage: any = multerS3({
      s3: s3,
      bucket: 'rightnow-image',
      acl: 'public-read',
      key: (req: any, file: any, cb: any) => {
        const regex: any = /^[a-z|A-Z|0-9|]+$/;
        let dot =
          file.originalname.split('.')[file.originalname.split('.').length - 1];
        dot = dot.toLowerCase();
        if (dot !== 'png' && dot !== 'jpg' && dot !== 'jpeg' && dot !== 'svg') {
          res.status(400).send({ message: 'Only image File format allowed.' });
          return;
        }
        let name = file.originalname;
        if (!regex.test(name)) {
          name = Math.random().toString(36).substring(0, 8) + '.' + dot;
        }
        imgUrl = 'chat/' + method.randomString(8, name);
        req.sendData = { url: process.env.IMG_URL + imgUrl };
        cb(null, imgUrl);
      },
    });
    let upload: any = multer({
      storage,
      limits: { fileSize: 1000 * 1000 * 10 },
    });
    upload.single('file')(req, res, next);
  },
};

export default messageValidation;
