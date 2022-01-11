import { Request, Response, NextFunction } from 'express';
import { CustomRequest } from '../type/type';

const dotenv: any = require('dotenv');
dotenv.config();

const db: any = require('../models/index');
const jwt: any = require('jsonwebtoken');

interface AccessTokenRequestValidation {
  accessTokenRequest(
    req: CustomRequest,
    res: Response,
    type: string,
    next: NextFunction,
  ): Promise<any>;
}

const accessTokenRequestValidation: AccessTokenRequestValidation = {
  async accessTokenRequest(
    req: CustomRequest,
    res: Response,
    type: string,
    next: NextFunction,
  ) {
    const refreshToken: any = req.cookies.refreshToken;
    if (!refreshToken) {
      req.sendData = { message: 'refreshToken not provided' };
      next();
    } else {
      jwt.verify(
        refreshToken,
        process.env.REFRESH_SECRET,
        async (err: any, decoded: any) => {
          if (err) {
            req.sendData = {
              message: 'invalid refresh token',
            };
            next();
          } else {
            if (type === 'adminReported') {
              const adminInfo: any = await db['User'].findOne({
                where: { email: decoded.email },
              });
              delete adminInfo.dataValues.password;
              if (adminInfo.role === 'ADMIN') {
                const accessToken: any = jwt.sign(
                  adminInfo.toJSON(),
                  process.env.ACCESS_SECRET,
                  {
                    expiresIn: '15m',
                  },
                );
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
                  data: {
                    reportedUserInfo: reportedUserInfo,
                    accessToken: accessToken,
                  },
                  message: 'ok, give new accessToken and refreshToken',
                };
                next();
              } else {
                req.sendData = {
                  message: 'not admin account',
                };
                next();
              }
            } else {
              const userInfo: any = await db['User'].findOne({
                where: { email: decoded.email },
              });
              delete userInfo.dataValues.password;
              if (!userInfo) {
                req.sendData = {
                  message: 'token has been tempered',
                };
                next();
              } else {
                const accessToken: any = jwt.sign(
                  userInfo.dataValues,
                  process.env.ACCESS_SECRET,
                  {
                    expiresIn: '15m',
                  },
                );
                if (type === 'update') {
                  const { email, nick_name } = req.body;
                  await db['User'].update({ nick_name }, { where: { email } });
                  userInfo.dataValues.nick_name = nick_name;
                }
                req.sendData = {
                  data: {
                    userInfo: userInfo.dataValues,
                    accessToken: accessToken,
                  },
                  message: 'ok, give new accessToken and refreshToken',
                };
                next();
              }
            }
          }
        },
      );
    }
  },
};

export default accessTokenRequestValidation;
