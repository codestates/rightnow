import { Request, Response, NextFunction } from 'express';
import { CustomRequest } from '../../type/type';

const dotenv: any = require('dotenv');
dotenv.config();

const db: any = require('../../models/index');
const jwt: any = require('jsonwebtoken');

interface AccessTokenRequestController {
  accessTokenRequest(
    req: CustomRequest,
    res: Response,
    type: string,
    next: NextFunction,
  ): Promise<any>;
}

const accessTokenRequestController: AccessTokenRequestController = {
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
            const userInfo = await db['User'].findOne({
              where: { email: decoded.email },
            });
            delete userInfo.dataValues.password;

            if (!userInfo) {
              req.sendData = {
                message: 'token has been tempered',
              };
              next();
            } else {
              const accessToken = jwt.sign(
                userInfo.dataValues,
                process.env.ACCESS_SECRET,
                {
                  expiresIn: '15m',
                },
              );
              if (type === 'update') {
                const { email, nickname } = req.body;
                await db['User'].update({ nickname }, { where: { email } });
                userInfo.dataValues.nickname = nickname;
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

export default accessTokenRequestController;
