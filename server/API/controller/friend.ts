import { Request, Response } from 'express';
import { CustomRequest } from '../../type/type';

const dotenv: any = require('dotenv');
dotenv.config();

interface FriendController {
  reqFriend(req: CustomRequest, res: Response): Promise<void>;
  resFriend(req: CustomRequest, res: Response): Promise<void>;
  deleteFriend(req: CustomRequest, res: Response): Promise<void>;
  requestList(req: CustomRequest, res: Response): Promise<void>;
  friendList(req: CustomRequest, res: Response): Promise<void>;
}

const friendController: FriendController = {
  /*
  친구 요청
  */
  async reqFriend(req: CustomRequest, res: Response): Promise<void> {
    if (req.sendData.message === 'ok') {
      res.status(200).send({ message: 'ok' });
    } else if (req.sendData.message === 'already exists friend List') {
      res.status(409).send({ message: 'you already exists friend List' });
    } else if (req.sendData.message === 'you already request friend') {
      res.status(400).send({ message: 'you already request friend' });
    } else if (req.sendData.message === 'you already recieved friend request') {
      res.status(409).send({ message: 'you already recieved friend request' });
    } else if (req.sendData.message === 'no exists user') {
      res.status(404).send({ message: 'no exists user' });
    } else if (req.sendData.message === 'dont have to request yourself') {
      res.status(404).send({ message: 'dont have to request yourself' });
    }
  },

  /*
  친구 수락, 거절
  */
  async resFriend(req: CustomRequest, res: Response): Promise<void> {
    if (req.sendData.message === 'ok, accepted') {
      res.status(200).send({ message: 'ok, accepted' });
    } else if (req.sendData.message === 'ok, rejected') {
      res.status(200).send({ message: 'ok, rejected' });
    } else if (req.sendData.message === 'already exists friend List') {
      res.status(409).send({ message: 'already exists friend List' });
    } else if (req.sendData.message === 'no exists request') {
      res.status(404).send({ message: 'no exists request' });
    } else if (req.sendData.message === 'no exists user') {
      res.status(404).send({ message: 'no exists user' });
    }
  },

  /*
  친구 삭제
  */
  async deleteFriend(req: CustomRequest, res: Response): Promise<void> {
    if (req.sendData.message === 'ok') {
      res.status(200).send({ message: 'ok' });
    } else if (req.sendData.message === 'no exists user') {
      res.status(404).send({ message: 'no exists user' });
    } else if (req.sendData.message === 'not friend') {
      res.status(404).send({ message: 'not friend' });
    }
  },

  /*
  요청이 온 친구 신청 목록 보기 
  */
  async requestList(req: CustomRequest, res: Response): Promise<void> {
    if (req.sendData.message === 'ok') {
      res.status(200).send({
        data: {
          RequestFriendList: req.sendData.data.RequestFriendList,
        },
        message: 'ok',
      });
    } else if (req.sendData.message === 'no exists userInfo') {
      res.status(404).send({ message: 'no exists userInfo' });
    }
  },

  /*
  나의 친구목록 보기
  */
  async friendList(req: CustomRequest, res: Response): Promise<void> {
    if (req.sendData.message === 'ok') {
      res.status(200).send({
        data: {
          FriendList: req.sendData.data.FriendList,
        },
        message: 'ok',
      });
    } else if (req.sendData.message === 'no exists userInfo') {
      res.status(404).send({ message: 'no exists userInfo' });
    }
  },
};

export default friendController;
