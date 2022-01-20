import { Request, Response } from 'express';
import { CustomRequest } from '../../type/type';

const dotenv: any = require('dotenv');
dotenv.config();

interface OAuthController {
  kakaoLogin(req: CustomRequest, res: Response): Promise<void>;
  googleLogin(req: CustomRequest, res: Response): Promise<void>;
}

const oauthController: OAuthController = {
  /*
  카카오 소셜로그인
  */
  async kakaoLogin(req: CustomRequest, res: Response): Promise<void> {
    if (req.sendData.message === 'ok') {
      res.cookie('refreshToken', req.sendData.data.refreshToken, {
        httpOnly: true,
      });
      console.log(req.sendData.data.userInfo);
      res.status(200).send({
        data: {
          userInfo: req.sendData.data.userInfo,
          accessToken: req.sendData.data.accessToken,
        },
        message: 'ok',
      });
    } else if (req.sendData.message === 'invalid accessToken') {
      res.status(404).send({ message: 'invalid accessToken' });
    } else if (req.sendData.message === 'Invalid authorization code') {
      res.status(404).send({ message: 'Invalid authorization code' });
    } else if (req.sendData.message === 'block user') {
      res.status(404).send({
        data: {
          block_date: req.sendData.data.block_date,
        },
        message: 'block user',
      });
    } else if (req.sendData.message === 'err') {
      res.status(500).send({ message: 'err' });
    }
  },

  /*
  구글 소셜로그인
  */
  async googleLogin(req: CustomRequest, res: Response): Promise<void> {
    if (req.sendData.message === 'ok') {
      res.cookie('refreshToken', req.sendData.data.refreshToken, {
        httpOnly: true,
      });
      res.redirect(`http://localhost:3000/load?message=ok&login=google`);
    } else if (
      req.sendData.message === 'invalid accessToken' ||
      req.sendData.message === 'Invalid authorization code'
    ) {
      res.redirect(`http://localhost:3000/load?message=err&login=google`);
    } else if (req.sendData.message === 'err') {
      res.status(500).send({ message: 'err' });
    } else if (req.sendData.message === 'block user') {
      res.status(404).send({
        data: {
          block_date: req.sendData.data.block_date,
        },
        message: 'block user',
      });
    }
  },
};

export default oauthController;
