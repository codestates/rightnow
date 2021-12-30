import { Request, Response } from "express";
import { CustomRequest } from "../../type/type";

interface UserController {
  login(req: CustomRequest, res: Response): Promise<void>;
  logout(req: CustomRequest, res: Response): Promise<void>;
  signup(req: CustomRequest, res: Response): Promise<void>;
  signout(req: CustomRequest, res: Response): Promise<void>;
}

const userController: UserController = {
  /* 
  로그인
  */
  async login(req: CustomRequest, res: Response): Promise<void> {
    // 작성
    // req.sendData={}
    if (req.sendData.message === "no exists email") {
      res.status(400).send({ message: "no exists email" });
    } else if (req.sendData.message === "incorrect password") {
      res.status(401).send({ message: "incorrect password" });
    } else if (req.sendData.message === "ok") {
      res.cookie("refreshToken", req.sendData.data.refreshToken, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });
      res.status(200).send({
        data: { accessToken: req.sendData.data.accessToken },
        message: "ok",
      });
    } else if (req.sendData.message === "err") {
      res.status(500).send({ message: "err" });
    }
  },

  /*
  로그아웃
  */
  async logout(req: CustomRequest, res: Response): Promise<void> {
    if (req.sendData.message === "ok") {
      // 클라이언트에서 aceessToken 지워주세요
      res.clearCookie("refreshToken");
      res.status(200).send({ message: "ok" });
    }
  },

  /*
  회원가입
  */
  async signup(req: CustomRequest, res: Response): Promise<void> {},

  /*
  회원탈퇴
  */
  async signout(req: CustomRequest, res: Response): Promise<void> {},
};

export default userController;
