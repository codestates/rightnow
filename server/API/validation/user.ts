import { Request, Response, NextFunction } from 'express';
import { CustomRequest } from '../../type/type';

const dotenv: any = require('dotenv');
dotenv.config();

const db: any = require('../../models/index');
const jwt: any = require('jsonwebtoken');
const axios: any = require('axios');
const bcrypt: any = require('bcrypt');

const accessTokenRequest: any = require('./accessTokenRequest');

interface UserValidation {
  login(req: CustomRequest, res: Response, next: NextFunction): Promise<any>;
  logout(req: CustomRequest, res: Response, next: NextFunction): Promise<any>;
  signup(req: CustomRequest, res: Response, next: NextFunction): Promise<any>;
  signout(req: CustomRequest, res: Response, next: NextFunction): Promise<any>;
  emailAuth(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ): Promise<any>;
  getUserInfo(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ): Promise<any>;
}

const userValidation: UserValidation = {
  /*
  로그인
  */
  async login(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ): Promise<any> {
    const { email, password } = req.body;
    const userInfo = await db['User'].findOne({
      where: { email },
    });

    if (!userInfo) {
      req.sendData = { message: 'no exists email' };
      next();
    }

    bcrypt.compare(
      password,
      userInfo.password,
      function (err: any, resp: any): void {
        if (resp === false) {
          req.sendData = { message: 'incorrect password' };
          next();
        } else if (resp === true) {
          delete userInfo.dataValues.password;

          const accessToken: any = jwt.sign(
            userInfo.dataValues,
            process.env.ACCESS_SECRET,
            {
              expiresIn: '15m',
            },
          );

          const refreshToken: any = jwt.sign(
            userInfo.dataValues,
            process.env.REFRESH_SECRET,
            {
              expiresIn: '30d',
            },
          );

          req.sendData = {
            data: { refreshToken: refreshToken, accessToken: accessToken },
            message: 'ok',
          };
          next();
        } else {
          req.sendData = { message: 'err' };
          next();
        }
      },
    );
  },

  /*
  로그아웃
  */
  async logout(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ): Promise<any> {
    req.sendData = { message: 'ok' };
    next();
  },

  /*
  회원가입
  */
  async signup(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ): Promise<any> {
    const { email, password, nickname } = req.body;
    if (!email || !password || !nickname) {
      req.sendData = { message: 'insufficient parameters supplied' };
      next();
    } else {
      const userInfo: any = await db['User'].findOne({
        where: { email },
      });
      if (userInfo) {
        req.sendData = { message: 'email exists' };
        next();
      } else {
        const encryptedPassword: any = bcrypt.hashSync(
          password,
          Number(process.env.PASSWORD_SALT),
        );
        db['User'].create({
          email,
          password: encryptedPassword,
          nickname,
        });
        const newUser: any = {
          email,
          nickname,
        };
        const accessToken: any = jwt.sign(newUser, process.env.ACCESS_SECRET, {
          expiresIn: '15m',
        });
        const refreshToken: any = jwt.sign(
          newUser,
          process.env.REFRESH_SECRET,
          {
            expiresIn: '30d',
          },
        );

        req.sendData = {
          data: {
            refreshToken: refreshToken,
            acccessToken: accessToken,
          },
          message: 'ok',
        };
        next();
      }
    }
  },

  /* 
  회원탈퇴
  */
  async signout(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ): Promise<any> {
    const { email, password } = req.body;
    const userInfo: any = await db['User'].findOne({
      where: { email },
    });

    bcrypt.compare(
      password,
      userInfo.password,
      function (err: any, resp: any): void {
        if (resp === false) {
          req.sendData = { message: 'incorrect password' };
          next();
        } else if (resp === true) {
          db['User'].destroy({
            where: { email: userInfo.email },
          });
          req.sendData = { message: 'ok' };
          next();
        } else {
          req.sendData = { message: 'err' };
          next();
        }
      },
    );
  },

  /*
  이메일 인증
  */
  async emailAuth(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ): Promise<any> {
    const { email, type } = req.body;

    let number: any = Math.floor(Math.random() * 1000000) + 100000;
    if (number > 1000000) {
      number = number - 100000;
    }
    let title: string;

    if (type === 'signup') {
      title = 'Form Bakery 회원가입 인증번호 입니다.';
    } else if (type === 'forgetPassword') {
      title = 'Form Bakery 비밀번호 재설정 인증번호 입니다.';
    }

    let html: any = `
            <h1>아래의 인증번호를 Form Bakery 홈페이지 인증번호창에 입력해 주세요.</h1>
            <h2>[${number}]</h2>
            <br/>
            <h3>문의: ${process.env.MAIL_EMAIL}</h3>
      `;

    req.sendData = {
      data: {
        subject: title,
        content: html,
        number: number,
      },
      message: 'ok',
    };
    next();
  },

  /*
  유저정보 가져오기
  */
  async getUserInfo(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ): Promise<any> {
    if (!req.headers.authorization) {
      await accessTokenRequest.accessTokenRequest(req, res);
      return;
    } else {
      jwt.verify(
        req.headers.authorization,
        process.env.ACCESS_SECRET,
        async (err, decoded) => {
          if (err) {
            await accessTokenRequest.accessTokenRequest(req, res);
          } else {
            const userInfo = await db['User'].findOne({
              where: { email: decoded.email },
            });
            if (!userInfo) {
              res.status(404).json({
                message: 'token has been tempered',
              });
            } else {
              delete userInfo.dataValues.password;
              res.status(200).json({
                data: {
                  userInfo: userInfo.dataValues,
                },
                message: 'ok',
              });
            }
          }
        },
      );
    }
  },
};

export default userValidation;
