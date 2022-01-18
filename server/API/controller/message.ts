import { Request, Response } from 'express';
import { CustomRequest } from '../../type/type';
interface MessageController {
  uploadImage(req: CustomRequest, res: Response): Promise<void>;
}

const messageController: MessageController = {
  async uploadImage(req: CustomRequest, res: Response): Promise<void> {
    res.status(200).send(req.sendData);
  },
};

export default messageController;
