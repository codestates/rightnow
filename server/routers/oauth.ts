import express, { Request, Response, Router, NextFunction } from 'express';
import oauthController from '../API/controller/oauth';
import oauthValidation from '../API/validation/oauth';

const oauthRouter: Router = express.Router();

oauthRouter.get(
  '/callback/kakao',
  oauthValidation.kakaoLogin,
  oauthController.kakaoLogin,
);
oauthRouter.get(
  '/callback/google',
  oauthValidation.googleLogin,
  oauthController.googleLogin,
);

export default oauthRouter;
