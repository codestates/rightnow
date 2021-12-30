import { Request, Response } from 'express';
import { CustomRequest } from '../../type/type';
interface AdminController {
  getReportedUser(req: CustomRequest, res: Response): Promise<void>;
}

const adminController: AdminController = {
  async getReportedUser(req: CustomRequest, res: Response): Promise<void> {
    // 작성
  },
};

export default adminController;
