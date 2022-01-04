import { Request, Response, NextFunction } from 'express';
import { CustomRequest } from '../../type/type';

const dotenv: any = require('dotenv');
dotenv.config();

const db: any = require('../../models/index');
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
            const { email } = req.body;
            const userInfo: any = await db['User'].findOne({
              where: { email: decoded.email },
            });
            delete userInfo.dataValues.password;

            if (type === 'admin') {
              const adminInfo: any = await db['User'].findOne({
                where: { email: decoded.email },
              });
              delete adminInfo.dataValues.password;
              if (!adminInfo) {
                req.sendData = {
                  message: 'token has been tempered',
                };
                next();
              } else {
                if (adminInfo.role === 'ROOT') {
                  const accessToken: any = jwt.sign(
                    adminInfo.dataValues,
                    process.env.ACCESS_SECRET,
                    {
                      expiresIn: '15m',
                    },
                  );
                  await db['User'].update(
                    { role: 'ADMIN' },
                    { where: { email } },
                  );
                  userInfo.dataValues.role = 'ADMIN';
                  req.sendData = {
                    data: {
                      userInfo: userInfo.dataValues,
                      accessToken: accessToken,
                    },
                    message: 'ok, give new accessToken and refreshToken',
                  };
                  next();
                } else {
                  req.sendData = { message: 'not root account' };
                }
              }
            } else {
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
