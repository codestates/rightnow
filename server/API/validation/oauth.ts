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
  getGoogleToken,
  getGoogleSubId,
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
      const kakaoAccessToken: any = await getKakaoToken(req.query.code);
      if (kakaoAccessToken) {
        const data: any = await getKakaoSubId(kakaoAccessToken);
        if (data) {
          const email: string = data.kakao_account.email;
          const nick_name: string = data.kakao_account.profile.nickname;
          const profile_image_url: string = data.kakao_account.profile
            ? data.kakao_account.profile.profile_image_url
            : null;
          const auth_code: string = data.id;

          const [user, created]: any = await db['User'].findOrCreate({
            where: { email: email, social_login: 'kakao' },
            defaults: {
              password: '',
              profile_image: profile_image_url,
              nick_name: nick_name,
              auth_code: auth_code,
            },
          });
          let userInfo: any = user;

          delete userInfo.dataValues.password;
          const accessToken: string = jwt.sign(
            userInfo.dataValues,
            process.env.ACCESS_SECRET,
            {
              expiresIn: '15m',
            },
          );
          const refreshToken: string = jwt.sign(
            userInfo.dataValues,
            process.env.REFRESH_SECRET,
            {
              expiresIn: '30d',
            },
          );

          req.sendData = {
            data: {
              userInfo: userInfo,
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
    } catch (e) {
      console.log(e);
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
  ): Promise<any> {
    try {
      const googleAccessToken: string = await getGoogleToken(req.query.code);
      if (googleAccessToken) {
        const data = await getGoogleSubId(googleAccessToken);
        console.log(data);
        if (data) {
          const email: string = data.email;
          const nick_name: string = data.email.split('@')[0];
          const profile_image_url: string = data.picture ? data.picture : null;
          const auth_code: string = data.sub;

          const [user, created]: any = await db['User'].findOrCreate({
            where: { email: email, social_login: 'google' },
            defaults: {
              password: '',
              profile_image: profile_image_url,
              nick_name: nick_name,
              auth_code: auth_code,
            },
          });
          let userInfo: any = user;
          delete userInfo.dataValues.password;

          const accessToken: string = jwt.sign(
            userInfo.dataValues,
            process.env.ACCESS_SECRET,
            {
              expiresIn: '15m',
            },
          );
          const refreshToken: string = jwt.sign(
            userInfo.dataValues,
            process.env.REFRESH_SECRET,
            {
              expiresIn: '30d',
            },
          );

          req.sendData = {
            data: {
              userInfo: userInfo,
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
    } catch (e) {
      console.log(e);
      req.sendData = {
        message: 'err',
      };
      next();
    }
  },
};

export default oauthValidation;
