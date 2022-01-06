import express, { Request, Response, Router, NextFunction } from 'express';
import friendController from '../API/controller/friend';
import friendValidation from '../API/validation/friend';

const friendRouter: Router = express.Router();

friendRouter.post(
  '/request',
  friendValidation.reqFriend,
  friendController.reqFriend,
);
friendRouter.post(
  '/response',
  friendValidation.resFriend,
  friendController.resFriend,
);
friendRouter.delete(
  '/',
  friendValidation.deleteFriend,
  friendController.deleteFriend,
);
friendRouter.post(
  '/search',
  friendValidation.searchFriend,
  friendController.searchFriend,
);
friendRouter.get(
  '/request/list',
  friendValidation.requestList,
  friendController.requestList,
);
friendRouter.get(
  '/list',
  friendValidation.friendList,
  friendController.friendList,
);

export default friendRouter;
