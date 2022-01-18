import { Request, Response, NextFunction } from 'express';
const moment: any = require('moment');

import { CustomRequest } from '../../type/type';
const dotenv: any = require('dotenv');
dotenv.config();

const cron: any = require('node-cron');

const db: any = require('../../models/index');
const jwt: any = require('jsonwebtoken');
import accessTokenRequestValidation from '../../method/token';
import { userInfo } from 'os';

const now: any = function (): void {
  return moment().format();
};

interface AdminValidation {
  getAllUser(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ): Promise<any>;
  getReportedUser(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ): Promise<any>;
  blockUser(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ): Promise<any>;
}

const adminValidation: AdminValidation = {
  /*
  전체유저목록 불러오기
  */
  async getAllUser(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ): Promise<any> {
    try {
      const userInfo: any = await db['User'].findAll();
      for (let i = 0; i < userInfo.length; i++) {
        delete userInfo[i].dataValues.password;
      }
      req.sendData = {
        data: { userInfo: userInfo },
        message: 'ok',
      };
      next();
    } catch (e) {
      console.log(e);
      req.sendData = {
        message: 'err',
      };
      next();
    }
  },

  /*
  신고된 유저와 메시지 보기
  */
  async getReportedUser(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ): Promise<any> {
    try {
      const type: string = 'adminReported';
      if (!req.headers.authorization) {
        await accessTokenRequestValidation.accessTokenRequest(
          req,
          res,
          type,
          next,
        );
        return;
      } else {
        jwt.verify(
          req.headers.authorization,
          process.env.ACCESS_SECRET,
          async (err: any, decoded: any) => {
            if (err) {
              await accessTokenRequestValidation.accessTokenRequest(
                req,
                res,
                type,
                next,
              );
              return;
            } else {
              const adminInfo: any = await db['User'].findOne({
                where: { email: decoded.email },
              });
              if (!adminInfo) {
                req.sendData = { message: 'token has been tempered' };
                next();
              } else {
                delete adminInfo.dataValues.password;
                if (adminInfo.role === 'ADMIN') {
                  let reportedUserInfo: any = await db['Message'].findAll({
                    include: [
                      {
                        model: db['Report_message'],
                      },
                      {
                        model: db['User'],
                      },
                    ],
                  });
                  reportedUserInfo = reportedUserInfo.map((el: any) => {
                    return el.dataValues;
                  });
                  for (let i = 0; i < reportedUserInfo.length; i++) {
                    delete reportedUserInfo[i].User.dataValues.password;
                  }

                  req.sendData = {
                    data: { reportedUserInfo: reportedUserInfo },
                    message: 'ok',
                  };
                  next();
                } else {
                  req.sendData = {
                    message: 'not admin account',
                  };
                  next();
                }
              }
            }
          },
        );
      }
    } catch (e) {
      console.log(e);
      req.sendData = {
        message: 'err',
      };
      next();
    }
  },

  /*
  신고된 유저 정지시키기
  */
  async blockUser(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ): Promise<any> {
    try {
      let { block_email, block_day } = req.body;
      if (block_day === '영구정지') {
        block_day = '99999';
      }
      const userInfo: any = await db['User'].findOne({
        where: { email: block_email },
      });
      delete userInfo.dataValues.password;
      delete userInfo.dataValues.auth_code;

      if (!userInfo) {
        req.sendData = { message: 'no exists email' };
        next();
        return;
      } else if (userInfo.dataValues.is_block === 'Y') {
        req.sendData = { message: 'already blocked user' };
        next();
        return;
      }

      const date: any = new Date();
      date.setDate(date.getDate() + Number(block_day));

      const year = date.getFullYear();
      const month = ('0' + (date.getMonth() + 1)).slice(-2);
      const day = ('0' + date.getDate()).slice(-2);

      const block_date: string = `${year}-${month}-${day}`;

      let reported_message: any = await db['Report_message'].findAll({
        include: [
          {
            model: db['Message'],
          },
        ],
      });
      reported_message = reported_message.map((el: any) => {
        return el.dataValues;
      });

      let count: number = 0;
      for (let i = 0; i < reported_message.length; i++) {
        if (reported_message[i].Message.dataValues.user_email === block_email) {
          count++;
          await db['Report_message'].update(
            { complete: 'Y' },
            { where: { message_id: reported_message[i].message_id } },
          );
        }
      }

      if (count === 0) {
        req.sendData = {
          message: 'user not reported',
        };
        next();
        return;
      }

      await db['User'].update(
        { block_date: block_date, is_block: 'Y' },
        { where: { email: block_email } },
      );

      userInfo.dataValues.block_date = block_date;
      userInfo.dataValues.is_block = 'Y';

      req.sendData = {
        data: {
          blockedUserInfo: userInfo,
        },
        message: 'ok',
      };
      next();

      cron.schedule(`0 0 0 * * *`, async () => {
        const d = new Date();
        const year = d.getFullYear();
        const month = ('0' + (d.getMonth() + 1)).slice(-2);
        const day = ('0' + d.getDate()).slice(-2);

        if (block_date === `${year}-${month}-${day}`) {
          await db['User'].update(
            { block_date: null, is_block: 'N' },
            { where: { email: block_email } },
          );
        }
      });
    } catch (e) {
      console.log(e);
      req.sendData = {
        message: 'err',
      };
      next();
    }
  },
};

export default adminValidation;
