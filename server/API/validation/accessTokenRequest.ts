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
  ): Promise<any>;
}

const accessTokenRequestController: AccessTokenRequestController = {
  async accessTokenRequest(req: CustomRequest, res: Response, type: string) {
    const refreshToken: any = req.cookies.refreshToken;
    if (!refreshToken) {
      res.status(403).json({ message: 'refresh token not provided' });
    } else {
      jwt.verify(
        refreshToken,
        process.env.REFRESH_SECRET,
        async (err: any, decoded: any) => {
          if (err) {
            res.status(400).json({
              message: 'invalid refresh token, please log in again',
            });
          } else {
            const userInfo = await db['User'].findOne({
              where: { email: decoded.email },
            });
            delete userInfo.dataValues.password;

            if (!userInfo) {
              res.status(404).json({
                message: 'token has been tempered',
              });
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

              res.status(200).json({
                data: {
                  userInfo: userInfo.dataValues,
                  accessToken: accessToken,
                },
                message: 'ok',
              });
            }
          }
        },
      );
    }
  },
};

export default accessTokenRequestController;
