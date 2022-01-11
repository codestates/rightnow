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
  async kakaoLogin(req: CustomRequest, res: Response): Promise<void> {},

  /*
  구글 소셜로그인
  */
  async googleLogin(req: CustomRequest, res: Response): Promise<void> {},

  /*
  카카오 로그아웃
  */
};

export default oauthController;
