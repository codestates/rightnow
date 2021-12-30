import express, { Request, Response, Router, NextFunction } from 'express';
import categoryController from '../API/controller/category';
import categoryValidation from '../API/validation/category';

const categoryRouter: Router = express.Router();

export default categoryRouter;
