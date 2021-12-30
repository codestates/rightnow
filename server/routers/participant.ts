import express, { Request, Response, Router, NextFunction } from 'express';
import participantController from '../API/controller/participant';
import participantValidation from '../API/validation/participant';

const participantRouter: Router = express.Router();

export default participantRouter;
