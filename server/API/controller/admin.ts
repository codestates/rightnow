import { Request, Response } from 'express';
import { CustomRequest } from '../../type/type';

const dotenv: any = require('dotenv');
dotenv.config();

interface AdminController {
  getReportedUser(req: CustomRequest, res: Response): Promise<void>;
  giveAuthority(req: CustomRequest, res: Response): Promise<void>;
  takeAuthority(req: CustomRequest, res: Response): Promise<void>;
}

const adminController: AdminController = {
  /*
  신고된 유저와 메시지 보기
  */
  async getReportedUser(req: CustomRequest, res: Response): Promise<void> {},

  /*
  관리자 권한 부여
  */
  async giveAuthority(req: CustomRequest, res: Response): Promise<void> {
    if (req.sendData.message === 'not root account') {
      res.status(404).send({ message: 'not root account' });
    } else if (req.sendData.message === 'ok') {
      res.status(200).send({
        data: { userInfo: req.sendData.data.userInfo },
        message: 'ok',
      });
    } else if (req.sendData.message === 'no exists user account') {
      res.status(409).send({ message: 'no exists user account' });
    } else if (
      req.sendData.message === 'refreshToken not provided' ||
      req.sendData.message === 'invalid refresh token' ||
      req.sendData.message === 'token has been tempered'
    ) {
      res
        .status(400)
        .json({ message: 'invalid refreshToken, please log in again' });
    } else if (req.sendData.message === 'token has been tempered') {
      res.status(403).json({
        message: 'token has been tempered',
      });
    } else if (
      req.sendData.message === 'ok, give new accessToken and refreshToken'
    ) {
      res.status(200).json({
        data: {
          userInfo: req.sendData.data.userInfo,
          accessToken: req.sendData.data.accessToken,
        },
        message: 'ok',
      });
    }
  },

  /* 
  관리자 권한 뺏기
  */
  async takeAuthority(req: CustomRequest, res: Response): Promise<void> {},
};

export default adminController;
