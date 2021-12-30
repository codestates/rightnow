import express, { Request, Response, Router, NextFunction } from "express";
import userController from "../API/controller/user";
import userValidation from "../API/validation/user";

const userRouter: Router = express.Router();

userRouter.post("/login", userValidation.login, userController.login);
userRouter.post("/logout", userValidation.logout, userController.logout);
userRouter.post("/signup", userValidation.signup, userController.signup);
userRouter.post("/signout", userValidation.signout, userController.signout);

export default userRouter;
