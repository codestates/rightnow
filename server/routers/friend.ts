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
friendRouter.post(
  '/request/list/:email',
  friendValidation.requestList,
  friendController.requestList,
);
friendRouter.post(
  '/list/:email',
  friendValidation.friendList,
  friendController.friendList,
);

export default friendRouter;
