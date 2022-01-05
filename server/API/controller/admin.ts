import { Request, Response } from 'express';
import { CustomRequest } from '../../type/type';

const dotenv: any = require('dotenv');
dotenv.config();

interface AdminController {
  getReportedUser(req: CustomRequest, res: Response): Promise<void>;
  blockUser(req: CustomRequest, res: Response): Promise<void>;
}

const adminController: AdminController = {
  /*
  신고된 유저와 메시지 보기
  */
  async getReportedUser(req: CustomRequest, res: Response): Promise<void> {
    if (req.sendData.message === 'ok') {
      res.status(200).send({
        data: { reportedUserInfo: req.sendData.data.reportedUserInfo },
        message: 'ok',
      });
    } else if (req.sendData.message === 'not admin account') {
      res.status(404).send({ message: 'not admin account' });
    } else if (
      req.sendData.message === 'token has been tempered' ||
      req.sendData.message === 'refreshToken not provided' ||
      req.sendData.message === 'invalid refresh token'
    ) {
      res
        .status(400)
        .json({ message: 'invalid refreshToken, please log in again' });
    } else if (
      req.sendData.message === 'ok, give new accessToken and refreshToken'
    ) {
      res.status(201).json({
        data: {
          reportedUserInfo: req.sendData.data.reportedUserInfo,
          accessToken: req.sendData.data.accessToken,
        },
        message: 'ok',
      });
    }
  },

  /*
  신고된 유저 정지시키기
  */
  async blockUser(req: CustomRequest, res: Response): Promise<void> {
    if (req.sendData.message === 'ok') {
      res.status(200).send({ message: 'ok' });
    }
  },
};

export default adminController;
