import { Request, Response, NextFunction } from 'express';
import { CustomRequest } from '../../type/type';

const dotenv: any = require('dotenv');
dotenv.config();
const multer: any = require('multer');
const multerS3: any = require('multer-s3');
const aws: any = require('aws-sdk');
aws.config.loadFromPath(__dirname + '/../../aws-config.json');
const s3 = new aws.S3();
const db: any = require('../../models/index');
const jwt: any = require('jsonwebtoken');
const bcrypt: any = require('bcrypt');
const { disconnectKakao } = require('../../method/oauth');
const method: any = require('../../method/custom');
import accessTokenRequestValidation from '../../method/token';

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
  updateUserInfo(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ): Promise<any>;
  changePassword(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ): Promise<any>;
  uploadProfileImage(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ): Promise<any>;
  reportUser(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ): Promise<any>;
  uploadImage(req: Request, res: Response, next: NextFunction): any;
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
    if (req.body.type === 'TEMP') {
      const { nick_name, password } = req.body;
      const userInfo: any = await db['User'].findOne({
        where: { nick_name },
      });
      if (!userInfo) {
        req.sendData = { message: 'no exists email' };
        next();
      } else {
        if (userInfo.is_block === 'Y') {
          req.sendData = {
            data: { block_date: userInfo.block_date },
            message: 'block user',
          };
          next();
          return;
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
      }
    } else {
      const { email, password } = req.body;
      const userInfo: any = await db['User'].findOne({
        where: { email },
      });
      if (!userInfo) {
        req.sendData = { message: 'no exists email' };
        next();
      } else {
        if (userInfo.is_block === 'Y') {
          req.sendData = {
            data: { block_date: userInfo.block_date },
            message: 'block user',
          };
          next();
          return;
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
      }
    }
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
    const { nick_name, password } = req.body;
    if (req.body.type === 'TEMP') {
      const userInfo: any = await db['User'].findOne({
        where: { nick_name },
      });
      if (!userInfo) {
        const encryptedPassword: any = bcrypt.hashSync(
          password,
          Number(process.env.PASSWORD_SALT),
        );
        const rightNow: any = new Date();
        const email: any = rightNow
          .toISOString()
          .slice(0, 19)
          .replace(/-/g, '')
          .replace(/:/g, '');
        db['User'].create({
          email,
          nick_name,
          password: encryptedPassword,
          role: 'TEMP',
        });
        const newUser: any = {
          email,
          nick_name,
          role: 'TEMP',
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
            accessToken: accessToken,
          },
          message: 'ok',
        };
        next();
      } else {
        req.sendData = { message: 'exists nickname' };
        next();
      }
    } else {
      const { email } = req.body;
      if (!email || !password || !nick_name) {
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
            nick_name,
            role: 'USER',
          });
          const newUser: any = {
            email,
            nick_name,
            role: 'USER',
          };

          const accessToken: any = jwt.sign(
            newUser,
            process.env.ACCESS_SECRET,
            {
              expiresIn: '15m',
            },
          );

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
              accessToken: accessToken,
            },
            message: 'ok',
          };
          next();
        }
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
    const { email, social_login } = req.body;
    const userInfo: any = await db['User'].findOne({
      where: { email },
    });
    if (!userInfo) {
      req.sendData = { message: 'no exists userInfo' };
      next();
      return;
    }
    if (social_login === 'kakao') {
      const kakaoId = await disconnectKakao(userInfo.auth_code);
      if (kakaoId) {
        db['User'].destroy({
          where: { email: userInfo.email },
        });
        req.sendData = { message: 'ok' };
        next();
      } else {
        req.sendData = { message: 'err' };
        next();
      }
    } else if (social_login === 'google') {
      db['User'].destroy({
        where: { email: userInfo.email },
      });
      req.sendData = { message: 'ok' };
      next();
    } else if (social_login === 'original') {
      const { password } = req.body;
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
    }
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
    const userInfo: any = await db['User'].findOne({
      where: { email },
    });
    if (type === 'signup') {
      if (userInfo) {
        req.sendData = { message: 'exists email' };
        next();
        return;
      }
    } else if (type === 'forgetPassword') {
      if (!userInfo) {
        req.sendData = { message: 'no exists email' };
        next();
        return;
      }
    }

    let number: any = Math.floor(Math.random() * 1000000) + 100000;
    if (number > 1000000) {
      number = number - 100000;
    }
    let title: string = '';

    if (type === 'signup') {
      title = 'RightNow 회원가입 인증번호 입니다.';
    } else if (type === 'forgetPassword') {
      title = 'RightNow 비밀번호 재설정 인증번호 입니다.';
    }

    let html: any = `
            <h1>아래의 인증번호를 RightNow 홈페이지 인증번호창에 입력해 주세요.</h1>
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
    const type: string = 'get';
    if (!req.headers.authorization) {
      await accessTokenRequestValidation.accessTokenRequest(
        req,
        res,
        type,
        next,
      );
      return;
    } else {
      jwt.verify(
        req.headers.authorization,
        process.env.ACCESS_SECRET,
        async (err: any, decoded: any) => {
          if (err) {
            await accessTokenRequestValidation.accessTokenRequest(
              req,
              res,
              type,
              next,
            );
            return;
          } else {
            const userInfo: any = await db['User'].findOne({
              where: { email: decoded.email },
            });
            if (!userInfo) {
              req.sendData = { message: 'token has been tempered' };
              next();
            } else {
              delete userInfo.dataValues.password;
              req.sendData = {
                data: { userInfo: userInfo.dataValues },
                message: 'ok',
              };
              next();
            }
          }
        },
      );
    }
  },

  /*
  회원정보 수정
  */
  async updateUserInfo(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ): Promise<any> {
    const { email, nick_name } = req.body;
    const type: string = 'update';

    if (!email || !nick_name) {
      res.send('err');
    } else if (!req.headers.authorization) {
      await accessTokenRequestValidation.accessTokenRequest(
        req,
        res,
        type,
        next,
      );
      return;
    } else {
      jwt.verify(
        req.headers.authorization,
        process.env.ACCESS_SECRET,
        async (err: any, decoded: any) => {
          if (err) {
            await accessTokenRequestValidation.accessTokenRequest(
              req,
              res,
              type,
              next,
            );
            return;
          } else {
            const userInfo: any = await db['User'].findOne({
              where: { email: decoded.email },
            });
            if (!userInfo) {
              req.sendData = { message: 'token has been tempered' };
              next();
            } else {
              delete userInfo.dataValues.password;
              await db['User'].update(
                { nick_name },
                { where: { email: decoded.email } },
              );
              userInfo.dataValues.nick_name = nick_name;
              req.sendData = {
                data: { userInfo: userInfo.dataValues },
                message: 'ok',
              };
              next();
            }
          }
        },
      );
    }
  },

  /*
  비밀번호 수정(잊어버린 비밀번호 수정/ 알고있는 비밀번호 수정)
  */
  async changePassword(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ): Promise<any> {
    const { email, new_password, type } = req.body;
    const userInfo: any = await db['User'].findOne({
      where: { email },
    });

    if (type === 'forget') {
      if (!userInfo) {
        req.sendData = { message: 'no exists email' };
        next();
      } else {
        const encryptedPassword: any = bcrypt.hashSync(
          new_password,
          Number(process.env.PASSWORD_SALT),
        );

        db['User'].update(
          { password: encryptedPassword },
          { where: { email } },
        );
        req.sendData = { message: 'ok' };
        next();
      }
    } else if (type === 'know') {
      const { password } = req.body;
      bcrypt.compare(
        password,
        userInfo.password,
        function (err: any, resp: any): void {
          if (resp === false) {
            req.sendData = { message: 'incorrect password' };
            next();
          } else if (resp === true) {
            const encryptedPassword: any = bcrypt.hashSync(
              new_password,
              Number(process.env.PASSWORD_SALT),
            );
            db['User'].update(
              { password: encryptedPassword },
              { where: { email } },
            );
            req.sendData = { message: 'ok' };
            next();
          } else {
            req.sendData = { message: 'err' };
            next();
          }
        },
      );
    }
  },

  /*
  프로필 이미지 업로드
  */
  async uploadProfileImage(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ): Promise<any> {
    if (req.file === undefined) {
      req.sendData = { message: 'no exists file' };
      next();
      return;
    }
    const { email } = req.params;
    const { filename } = req.file;

    db['User']
      .update(
        {
          profile_image: filename,
        },
        {
          where: { email },
        },
      )
      .then((result: any) => {
        if (result) {
          req.sendData = { data: { profile_image: filename }, message: 'ok' };
          next();
        } else {
          req.sendData = { message: 'err' };
          next();
        }
      });
  },

  /*
  유저 신고하기
  */
  async reportUser(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ): Promise<any> {
    const { message_id, reporter_email } = req.body;
    if (message_id && reporter_email) {
      const userInfo: any = await db['User'].findOne({
        where: { email: reporter_email },
      });
      const message: any = await db['Message'].findOne({
        where: { id: message_id },
      });

      if (userInfo && message) {
        db['Report_message'].create({
          message_id: Number(message_id),
          reporter: reporter_email,
        });
        req.sendData = { message: 'ok' };
        next();
      } else {
        req.sendData = { message: 'incorrect parameters supplied' };
        next();
      }
    } else {
      req.sendData = { message: 'insufficient parameters supplied' };
      next();
    }
  },

  uploadImage(req: Request, res: Response, next: NextFunction): any {
    const DIR_NAME = __dirname + '/../..';
    // const storage: any = multer.diskStorage({
    //   destination: (req: any, file: any, cb: any): void => {
    //     cb(null, DIR_NAME + '/image/user/'); // 파일 업로드 경로
    //   },
    //   filename: (req: any, file: any, cb: any): void => {
    //     const regex: any = /^[a-z|A-Z|0-9|]+$/;
    //     let dot =
    //       file.originalname.split('.')[file.originalname.split('.').length - 1];
    //     if (dot !== 'png' && dot !== 'jpg' && dot !== 'jepg') {
    //       // return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    //       res
    //         .status(400)
    //         .send({ message: 'Only .png, .jpg and .jpeg format allowed' });
    //       return;
    //     }
    //     let name = file.originalname;
    //     if (!regex.test(name)) {
    //       name = Math.random().toString(36).substring(0, 8) + '.' + dot;
    //     }
    //     cb(null, method.randomString(8, name)); //파일 이름 설정
    //   },
    // });

    const storage: any = multerS3({
      s3: s3,
      bucket: 'rightnow-image',
      acl: 'public-read',
      key: (req: any, file: any, cb: any) => {
        const regex: any = /^[a-z|A-Z|0-9|]+$/;
        let dot =
          file.originalname.split('.')[file.originalname.split('.').length - 1];
        if (dot !== 'png' && dot !== 'jpg' && dot !== 'jepg') {
          res
            .status(400)
            .send({ message: 'Only .png, .jpg and .jpeg format allowed.' });
          return;
        }
        let name = file.originalname;
        if (!regex.test(name)) {
          name = Math.random().toString(36).substring(0, 8) + '.' + dot;
        }
        cb(null, 'user/' + method.randomString(8, name));
      },
    });
    let upload: any = multer({
      storage,
      limits: { fileSize: 1000 * 1000 * 10 },
    });
    upload.single('file')(req, res, next);
  },
};

export default userValidation;
