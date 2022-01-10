import { Request, Response, NextFunction } from 'express';
import { CustomRequest } from '../../type/type';

const dotenv: any = require('dotenv');
dotenv.config();

const db: any = require('../../models/index');
const jwt: any = require('jsonwebtoken');
const bcrypt: any = require('bcrypt');
const {
  getKakaoToken,
  getKakaoSubId,
  disconnectKakao,
} = require('../../method/oauth');

import accessTokenRequestValidation from '../../method/token';

interface OAuthValidation {
  kakaoLogin(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ): Promise<any>;
  googleLogin(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ): Promise<any>;
}

const oauthValidation: OAuthValidation = {
  /*
  카카오 소셜로그인
  */
  async kakaoLogin(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ): Promise<any> {
    try {
      const kakaoAccessToken = await getKakaoToken(req.body.kakaocode)
        .access_token;

      if (kakaoAccessToken) {
        const data = await getKakaoSubId(kakaoAccessToken);

        if (data) {
          const email = data.kakao_account.email;
          const nick_name = data.kakao_account.profile.nickname;
          const profile_image_url = data.kakao_account.profile
            ? data.kakao_account.profile.profile_image_url
            : null;

          const [user, created] = await db['User'].findOrCreate({
            where: { email: email, is_social: 'kakao' },
            defaults: {
              profile_image: profile_image_url,
              nick_name: nick_name,
            },
          });
          let userInfo: any = user;
          if (created) {
            userInfo = created;
          }
          const accessToken: any = jwt.sign(
            userInfo,
            process.env.ACCESS_SECRET,
            {
              expiresIn: '15m',
            },
          );
          const refreshToken: any = jwt.sign(
            userInfo,
            process.env.REFRESH_SECRET,
            {
              expiresIn: '30d',
            },
          );

          req.sendData = {
            data: {
              refreshToken: refreshToken,
              accessToken: accessToken,
            },
            message: 'ok',
          };
          next();
        } else {
          req.sendData = {
            message: 'invalid accessToken',
          };
          next();
        }
      } else {
        req.sendData = {
          message: 'Invalid authorization code',
        };
        next();
      }
    } catch {
      req.sendData = {
        message: 'err',
      };
      next();
    }
  },

  /*
  구글 소셜로그인
  */
  async googleLogin(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ): Promise<any> {},
};

export default oauthValidation;
