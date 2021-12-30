import { Request, Response, NextFunction } from 'express';
import { CustomRequest } from '../../type/type';
interface AdminValidation {
  test(req: CustomRequest, res: Response, next: NextFunction): void;
}

const adminValidation: AdminValidation = {
  test(req: CustomRequest, res: Response, next: NextFunction) {
    // ....db처리 후
    //req.sendData = 'send';
    next();
  },
};

export default adminValidation;
