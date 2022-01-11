import { Request, Response } from 'express';
import { CustomRequest } from '../../type/type';
interface ParticipantController {
  checkParticipantAPI(req: CustomRequest, res: Response): Promise<any>;
  getLocationForKakao(req: CustomRequest, res: Response): Promise<any>;
}

const participantController: ParticipantController = {
  async checkParticipantAPI(req: CustomRequest, res: Response): Promise<any> {
    let { data, code, message } = req.sendData;
    res.status(code).send({
      data,
      message,
    });
  },
  async getLocationForKakao(req: CustomRequest, res: Response): Promise<any> {
    res.status(req.sendData.status).send(req.sendData);
  },
};

export default participantController;
