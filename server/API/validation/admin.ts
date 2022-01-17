import { Request, Response, NextFunction } from 'express';
const moment: any = require('moment');

import { CustomRequest } from '../../type/type';
const dotenv: any = require('dotenv');
dotenv.config();

const cron: any = require('node-cron');

const db: any = require('../../models/index');
const jwt: any = require('jsonwebtoken');
import accessTokenRequestValidation from '../../method/token';

const now: any = function (): void {
  return moment().format();
};

interface AdminValidation {
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
      const { block_emails, block_date } = req.body;
      for (let i = 0; i < block_emails.length; i++) {
        await db['User'].update(
          { block_date: block_date, is_block: 'Y' },
          { where: { email: block_emails[i] } },
        );
      }
      req.sendData = {
        message: 'ok',
      };
      next();

      cron.schedule(`0 0 0 * * *`, async () => {
        const d = new Date();
        const year = d.getFullYear();
        const month = ('0' + (d.getMonth() + 1)).slice(-2);
        const day = ('0' + d.getDate()).slice(-2);

        for (let i = 0; i < block_emails.length; i++) {
          if (block_date === `${year}-${month}-${day}`) {
            await db['User'].update(
              { block_date: null, is_block: 'N' },
              { where: { email: block_emails[i] } },
            );
          }
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
