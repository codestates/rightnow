import { Request, Response, NextFunction } from 'express';
import { CustomRequest } from '../../type/type';
import { Op } from 'sequelize';

const dotenv: any = require('dotenv');
dotenv.config();

const db: any = require('../../models/index');
const jwt: any = require('jsonwebtoken');
const bcrypt: any = require('bcrypt');

interface FriendValidation {
  reqFriend(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ): Promise<any>;
  resFriend(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ): Promise<any>;
  deleteFriend(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ): Promise<any>;
  requestList(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ): Promise<any>;
  friendList(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ): Promise<any>;
}

const friendValidation: FriendValidation = {
  /* 
  친구 요청
  */
  async reqFriend(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ): Promise<any> {
    try {
      const { req_user, res_user } = req.body;
      if (req_user === res_user) {
        req.sendData = { message: 'dont have to request yourself' };
        next();
        return;
      }
      const reqFriend: any = await db['Friend'].findOne({
        where: { req_user, res_user },
      });
      const resFriend: any = await db['Friend'].findOne({
        where: { req_user: res_user, res_user: req_user },
      });
      const userInfo: any = await db['User'].findOne({
        where: { email: req_user },
      });
      const userInfo2: any = await db['User'].findOne({
        where: { email: res_user },
      });
      if (!userInfo || !userInfo2) {
        req.sendData = { message: 'no exists user' };
        next();
        return;
      }
      if (
        (reqFriend && reqFriend.dataValues.is_accept === 'Y') ||
        (resFriend && resFriend.dataValues.is_accept === 'Y')
      ) {
        req.sendData = { message: 'already exists friend List' };
        next();
      } else if (reqFriend && reqFriend.dataValues.is_accept === 'N') {
        req.sendData = { message: 'you already request friend' };
        next();
      } else if (resFriend && resFriend.dataValues.is_accept === 'N') {
        req.sendData = { message: 'you already recieved friend request' };
        next();
      } else if (!reqFriend || !resFriend) {
        db['Friend'].create({
          req_user,
          res_user,
        });
        req.sendData = { message: 'ok' };
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
  친구 수락, 거절
  */
  async resFriend(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ): Promise<any> {
    try {
      const { req_user, res_user, answer } = req.body;
      const reqFriend: any = await db['Friend'].findOne({
        where: { req_user, res_user },
      });
      const userInfo: any = await db['User'].findOne({
        where: { email: req_user },
      });
      const userInfo2: any = await db['User'].findOne({
        where: { email: res_user },
      });
      if (!userInfo || !userInfo2) {
        req.sendData = { message: 'no exists user' };
        next();
        return;
      }
      if (reqFriend && reqFriend.dataValues.is_accept === 'N') {
        if (answer === 'accept') {
          await db['Friend'].update(
            { is_accept: 'Y' },
            { where: { id: reqFriend.dataValues.id } },
          );
          req.sendData = { message: 'ok, accepted' };
          next();
        } else if (answer === 'reject') {
          db['Friend'].destroy({
            where: { id: reqFriend.dataValues.id },
          });
          req.sendData = { message: 'ok, rejected' };
          next();
        }
      } else if (reqFriend && reqFriend.dataValues.is_accept === 'Y') {
        req.sendData = { message: 'already exists friend List' };
        next();
      } else if (!reqFriend) {
        req.sendData = { message: 'no exists request' };
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
  친구 삭제
  */
  async deleteFriend(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ): Promise<any> {
    try {
      const { user_email, friend_email } = req.body;
      const friendList: any = await db['Friend'].findOne({
        where: { req_user: user_email, res_user: friend_email },
      });
      const friendList2: any = await db['Friend'].findOne({
        where: { req_user: friend_email, res_user: user_email },
      });
      const userInfo: any = await db['User'].findOne({
        where: { email: user_email },
      });
      const userInfo2: any = await db['User'].findOne({
        where: { email: friend_email },
      });
      if (!userInfo || !userInfo2) {
        req.sendData = { message: 'no exists user' };
        next();
        return;
      }
      if (friendList && friendList.dataValues.is_accept === 'Y') {
        db['Friend'].destroy({
          where: { id: friendList.dataValues.id },
        });
        req.sendData = { message: 'ok' };
        next();
      } else if (friendList2 && friendList2.dataValues.is_accept === 'Y') {
        db['Friend'].destroy({
          where: { id: friendList2.dataValues.id },
        });
        req.sendData = { message: 'ok' };
        next();
      } else {
        req.sendData = { message: 'not friend' };
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
  요청이 온  친구 신청 목록 보기 
  */
  async requestList(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ): Promise<any> {
    try {
      const { email } = req.params;
      const userInfo: any = await db['User'].findOne({
        where: { email: email },
      });
      if (!userInfo) {
        req.sendData = { message: 'no exists userInfo' };
        next();
        return;
      }
      let RequestFriend: any = await db['Friend'].findAll({
        where: { res_user: email },
      });
      RequestFriend = RequestFriend.filter((el: any) => {
        return el.dataValues.is_accept === 'N';
      });
      RequestFriend = RequestFriend.map((el: any) => {
        return el.req_user;
      });
      const RequestFriendList = await db['User'].findAll({
        where: { email: { [Op.in]: RequestFriend } },
        attributes: { exclude: ['password'] },
        order: [['nick_name', 'ASC']],
      });
      req.sendData = {
        data: { RequestFriendList: RequestFriendList },
        message: 'ok',
      };
      next();
    } catch (e) {
      console.log(e);
      req.sendData = {
        message: 'err',
      };
      next();
    }
  },

  /*
  나의 친구목록 보기
  */
  async friendList(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ): Promise<any> {
    try {
      const { email } = req.params;
      const userInfo: any = await db['User'].findOne({
        where: { email },
      });
      if (!userInfo) {
        req.sendData = { message: 'no exists userInfo' };
        next();
        return;
      }
      let FriendList1: string[] = await db['Friend'].findAll({
        where: { req_user: email },
      });
      let FriendList2: string[] = await db['Friend'].findAll({
        where: { res_user: email },
      });
      FriendList1 = FriendList1.filter((el: any) => {
        return el.dataValues.is_accept === 'Y';
      });
      FriendList2 = FriendList2.filter((el: any) => {
        return el.dataValues.is_accept === 'Y';
      });
      FriendList1 = FriendList1.map((el: any) => {
        return el.res_user;
      });
      FriendList2 = FriendList2.map((el: any) => {
        return el.req_user;
      });
      const FriendList3: string[] = [...FriendList1, ...FriendList2];
      const FriendList = await db['User'].findAll({
        where: { email: { [Op.in]: FriendList3 } },
        attributes: { exclude: ['password'] },
        order: [['nick_name', 'ASC']],
      });
      req.sendData = { data: { FriendList: FriendList }, message: 'ok' };
      next();
    } catch (e) {
      console.log(e);
      req.sendData = {
        message: 'err',
      };
      next();
    }
  },
};

export default friendValidation;
