import express, { Request, Response, Router, NextFunction } from 'express';
import categoryController from '../API/controller/category';
import categoryValidation from '../API/validation/category';

const categoryRouter: Router = express.Router();

categoryRouter.post(
  '/create',
  categoryValidation.createCategory,
  categoryController.createCategory,
);
categoryRouter.get(
  '/list',
  categoryValidation.readCategory,
  categoryController.readCategory,
);
categoryRouter.patch(
  '/update',
  categoryValidation.updateCategory,
  categoryController.updateCategory,
);
categoryRouter.delete(
  '/',
  categoryValidation.deleteCategory,
  categoryController.deleteCategory,
);

export default categoryRouter;
