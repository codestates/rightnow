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
      res.status(201).send({
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
    } else {
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
      res.status(201).send({
        data: {
          userInfo: req.sendData.data.userInfo,
          accessToken: req.sendData.data.accessToken,
        },
        message: 'ok',
      });
      // res.redirect(
      //   `http://localhost:3000?message=ok&accessToken=${req.sendData.data.accessToken}&login=google`,
      // );
    } else if (req.sendData.message === 'invalid accessToken') {
      res.status(404).send({ message: 'invalid accessToken' });
      // res.redirect(`http://localhost:3000?message=err&login=google`);
    } else if (req.sendData.message === 'Invalid authorization code') {
      res.status(404).send({ message: 'Invalid authorization code' });
      // res.redirect(`http://localhost:3000?message=err&login=google`);
    } else {
      res.status(500).send({ message: 'err' });
    }
  },
};

export default oauthController;
