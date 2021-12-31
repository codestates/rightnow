import { Request, Response } from 'express';
import { CustomRequest } from '../../type/type';

const mailMethod: any = require('../../method/mail.ts');
const dotenv: any = require('dotenv');
dotenv.config();

interface UserController {
  login(req: CustomRequest, res: Response): Promise<void>;
  logout(req: CustomRequest, res: Response): Promise<void>;
  signup(req: CustomRequest, res: Response): Promise<void>;
  signout(req: CustomRequest, res: Response): Promise<void>;
  emailAuth(req: CustomRequest, res: Response): Promise<void>;
  getUserInfo(req: CustomRequest, res: Response): Promise<void>;
}

const userController: UserController = {
  /* 
  로그인
  */
  async login(req: CustomRequest, res: Response): Promise<void> {
    // 작성
    if (req.sendData.message === 'no exists email') {
      res.status(400).send({ message: 'no exists email' });
    } else if (req.sendData.message === 'incorrect password') {
      res.status(401).send({ message: 'incorrect password' });
    } else if (req.sendData.message === 'ok') {
      res.cookie('refreshToken', req.sendData.data.refreshToken, {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      });
      res.status(200).send({
        data: { accessToken: req.sendData.data.accessToken },
        message: 'ok',
      });
    } else if (req.sendData.message === 'err') {
      res.status(500).send({ message: 'err' });
    }
  },

  /*
  로그아웃
  */
  async logout(req: CustomRequest, res: Response): Promise<void> {
    if (req.sendData.message === 'ok') {
      res.clearCookie('refreshToken');
      res.status(200).send({ message: 'ok' });
    }
  },

  /*
  회원가입
  */
  async signup(req: CustomRequest, res: Response): Promise<void> {
    console.log(req.sendData);

    if (req.sendData.message === 'insufficient parameters supplied') {
      res.status(422).send({ message: 'insufficient parameters supplied' });
    } else if (req.sendData.message === 'email exists') {
      res.status(409).send({ message: 'email exists' });
    } else if (req.sendData.message === 'ok') {
      res
        .status(201)
        .cookie('refreshToken', req.sendData.data.refreshToken, {
          httpOnly: true,
          sameSite: 'none',
        })
        .send({
          data: { accessToken: req.sendData.data.accessToken },
          message: 'ok',
        });
    }
  },

  /*
  회원탈퇴
  */
  async signout(req: CustomRequest, res: Response): Promise<void> {
    if (req.sendData.message === 'incorrect password') {
      res.status(404).send({ message: 'incorrect password' });
    } else if (req.sendData.message === 'ok') {
      res.status(200).send({ message: 'ok' });
    } else if (req.sendData.message === 'err') {
      res.status(500).send({ message: 'err' });
    }
  },

  /*
  이메일 인증
  */
  async emailAuth(req: CustomRequest, res: Response): Promise<void> {
    if (req.sendData.message === 'ok') {
      const { email } = req.body;
      mailMethod.sendEmail(
        req,
        res,
        process.env.MAIL_EMAIL,
        email,
        req.sendData.data.subject,
        req.sendData.data.content,
        true,
        req.sendData.data.number,
      );
    }
  },

  /* 
  유저정보 가져오기
  */
  async getUserInfo(req: CustomRequest, res: Response): Promise<void> {
    if (req.sendData.message === 'ok') {
      res.status(200).json({
        data: {
          userInfo: req.sendData.data.userInfo.dataValues,
        },
        message: 'ok',
      });
    } else if (req.sendData.message === 'token has been tempered') {
      res.status(404).json({
        message: 'token has been tempered',
      });
    } else if (
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
          userInfo: req.sendData.data.userInfo.dataValues,
          accessToken: req.sendData.data.accessToken,
        },
        message: 'ok',
      });
    }
  },
};
export default userController;
