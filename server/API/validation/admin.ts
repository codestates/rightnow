import { AnyRecord } from 'dns';
import { Request, Response, NextFunction } from 'express';
import { CustomRequest } from '../../type/type';
const dotenv: any = require('dotenv');
dotenv.config();

const db: any = require('../../models/index');
const jwt: any = require('jsonwebtoken');
const axios: any = require('axios');
const bcrypt: any = require('bcrypt');
import accessTokenRequestValidation from './accessTokenRequest';

interface AdminValidation {
  getReportedUser(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ): Promise<any>;
  giveAuthority(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ): Promise<any>;
  takeAuthority(
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
    const type: string = 'admin';
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
                const reportedUserInfo: any = await db[
                  'Report_Messages'
                ].findall();
                console.log(reportedUserInfo);
                req.sendData = {
                  // data: { userInfo: userInfo.dataValues },
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
  },

  /*
  관리자 권한 부여
  */
  async giveAuthority(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ): Promise<any> {
    const { email } = req.body;
    const type: string = 'admin';
    const userInfo: any = await db['User'].findOne({
      where: { email },
    });

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
            if (adminInfo.role === 'ROOT') {
              if (userInfo) {
                delete userInfo.dataValues.password;
                await db['User'].update(
                  { role: 'ADMIN' },
                  { where: { email } },
                );
                userInfo.dataValues.role = 'ADMIN';
                req.sendData = {
                  data: { userInfo: userInfo.dataValues },
                  message: 'ok',
                };
                next();
              } else if (!userInfo) {
                req.sendData = { message: 'no exists user account' };
                next();
              }
            } else {
              req.sendData = { message: 'not root account' };
              next();
            }
          }
        },
      );
    }
  },

  /*
  관리자 권한 뺏기
  */
  async takeAuthority(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ): Promise<any> {},
};

export default adminValidation;
