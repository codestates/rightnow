import { Request, Response, NextFunction } from 'express';
import { CustomRequest } from '../../type/type';

const dotenv: any = require('dotenv');
dotenv.config();

const db: any = require('../../models/index');
const jwt: any = require('jsonwebtoken');
const axios: any = require('axios');
const bcrypt: any = require('bcrypt');

interface UserValidation {
  login(req: CustomRequest, res: Response, next: NextFunction): Promise<any>;
  logout(req: CustomRequest, res: Response, next: NextFunction): Promise<any>;
  signup(req: CustomRequest, res: Response, next: NextFunction): Promise<any>;
  signout(req: CustomRequest, res: Response, next: NextFunction): Promise<any>;
}

const userValidation: UserValidation = {
  /*
  로그인
  */
  async login(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    const { email, password } = req.body;
    const userInfo = await db['User'].findOne({
      where: { email },
    });

    if (!userInfo) {
      req.sendData = { message: 'no exists email' };
      next();
    }

    bcrypt.compare(password, userInfo.password, function (err, resp) {
      if (resp === false) {
        req.sendData = { message: 'incorrect password' };
        next();
      } else if (resp === true) {
        delete userInfo.dataValues.password;

        const accessToken = jwt.sign(
          userInfo.dataValues,
          process.env.ACCESS_SECRET,
          {
            expiresIn: '15m',
          }
        );

        const refreshToken = jwt.sign(
          userInfo.dataValues,
          process.env.REFRESH_SECRET,
          {
            expiresIn: '30d',
          }
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
    });
  },

  /*
  로그아웃
  */
  async logout(
    req: CustomRequest,
    res: Response,
    next: NextFunction
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
    next: NextFunction
  ): Promise<any> {
    const { email, password, nickname } = req.body;
    if (!email || !password || !nickname) {
      // res.status(422).send({ message: "insufficient parameters supplied" });
      req.sendData = { message: '' };
      next();
    } else {
      const userInfo = await db['User'].findOne({
        where: { email },
      });
      if (userInfo) {
        res.status(409).send({ message: 'email exists' });
      } else {
        const encryptedPassword = bcrypt.hashSync(
          password,
          Number(process.env.PASSWORD_SALT)
        );
        db['User'].create({
          email,
          password: encryptedPassword,
          nickname,
        });
        const newUser = {
          email,
          name,
          nickname,
        };
        const accessToken = jwt.sign(newUser, process.env.ACCESS_SECRET, {
          expiresIn: '15m',
        });
        const refreshToken = jwt.sign(newUser, process.env.REFRESH_SECRET, {
          expiresIn: '30d',
        });
        res
          .status(201)
          .cookie('refreshToken', refreshToken, {
            httpOnly: true,
            // samSite: "none",
          })
          .json({
            data: { accessToken: accessToken },
            message: 'signup successful',
          });
      }
    }
  },

  /* 
  회원탈퇴
  */
  async signout(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<any> {},
};

export default userValidation;
