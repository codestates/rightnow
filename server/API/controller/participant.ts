import { Request, Response } from 'express';
import { CustomRequest } from '../../type/type';
interface ParticipantController {
  getLocationForKakao(req: CustomRequest, res: Response): Promise<any>;
}

const participantController: ParticipantController = {
  async getLocationForKakao(req: CustomRequest, res: Response): Promise<any> {
    res.status(req.sendData.status).send(req.sendData);
  },
};

export default participantController;
