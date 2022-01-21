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
      console.log('refresh' + refreshToken);
      req.sendData = { message: 'refreshToken not provided' };
      next();
    } else {
      console.log('refresh' + refreshToken);
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
            const userInfo: any = await db['User'].findOne({
              where: { email: decoded.email },
            });
            delete userInfo.dataValues.password;
            delete userInfo.dataValues.auth_code;
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
                const { nick_name } = req.body;
                await db['User'].update(
                  { nick_name },
                  { where: { email: userInfo.email } },
                );
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
        },
      );
    }
  },
};

export default accessTokenRequestValidation;
