import { Request, Response } from 'express';
import { CustomRequest } from '../../type/type';

const dotenv: any = require('dotenv');
dotenv.config();

interface AdminController {
  getAllUser(req: CustomRequest, res: Response): Promise<void>;
  getReportedUser(req: CustomRequest, res: Response): Promise<void>;
  blockUser(req: CustomRequest, res: Response): Promise<void>;
}

const adminController: AdminController = {
  /*
  전체유저목록 불러오기
  */
  async getAllUser(req: CustomRequest, res: Response): Promise<void> {
    if (req.sendData.message === 'ok') {
      res.status(200).send({
        data: { userInfo: req.sendData.data.userInfo },
        message: 'ok',
      });
    } else if (req.sendData.message === 'err') {
      res.status(500).send({ message: 'err' });
    }
  },

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
      res.status(200).json({
        data: {
          reportedUserInfo: req.sendData.data.reportedUserInfo,
          accessToken: req.sendData.data.accessToken,
        },
        message: 'ok',
      });
    } else if (req.sendData.message === 'err') {
      res.status(500).send({ message: 'err' });
    }
  },

  /*
  신고된 유저 정지시키기
  */
  async blockUser(req: CustomRequest, res: Response): Promise<void> {
    if (req.sendData.message === 'ok') {
      res.status(200).send({
        data: { blockedUserInfo: req.sendData.data.blockedUserInfo },
        message: 'ok',
      });
    } else if (req.sendData.message === 'no exists email') {
      res.status(404).send({ message: 'no exists email' });
    } else if (req.sendData.message === 'user not reported') {
      res.status(404).send({ message: 'user not reported' });
    } else if (req.sendData.message === 'already blocked user') {
      res.status(409).send({ message: 'already blocked user' });
    } else if (req.sendData.message === 'err') {
      res.status(500).send({ message: 'err' });
    }
  },
};

export default adminController;
