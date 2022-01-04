import { Request, Response } from 'express';
import { CustomRequest } from '../../type/type';

const dotenv: any = require('dotenv');
dotenv.config();

interface CategoryController {
  createCategory(req: CustomRequest, res: Response): Promise<void>;
  readCategory(req: CustomRequest, res: Response): Promise<void>;
  updateCategory(req: CustomRequest, res: Response): Promise<void>;
  deleteCategory(req: CustomRequest, res: Response): Promise<void>;
}

const categoryController: CategoryController = {
  /*
  카테고리 생성
  */
  async createCategory(req: CustomRequest, res: Response): Promise<void> {
    if (req.sendData.message === 'ok') {
      res.status(201).send({ message: 'ok' });
    } else if (req.sendData.message === 'insufficient parameters') {
      res.status(400).send({ message: 'insufficient parameters' });
    } else if (req.sendData.message === 'already exists category name') {
      res.status(409).send({ message: 'already exists category name' });
    } else {
      res.status(500).send({ message: 'err' });
    }
  },

  /*
  카테고리 목록 읽기
  */
  async readCategory(req: CustomRequest, res: Response): Promise<void> {
    if (req.sendData.message === 'ok') {
      res.status(200).send({
        data: { categoryList: req.sendData.data.categoryList },
        message: 'ok',
      });
    } else {
      res.status(500).send({ message: 'err' });
    }
  },

  /*
  카테고리 수정
  */
  async updateCategory(req: CustomRequest, res: Response): Promise<void> {
    if (req.sendData.message === 'ok') {
      res.status(200).send({ message: 'ok' });
    } else if (req.sendData.message === 'insufficient parameters') {
      res.status(400).send({ message: 'insufficient parameters' });
    } else if (req.sendData.message === 'no exists category name') {
      res.status(404).send({ message: 'no exists category name' });
    } else {
      res.status(500).send({ message: 'err' });
    }
  },

  /*
  카테고리 삭제
  */
  async deleteCategory(req: CustomRequest, res: Response): Promise<void> {
    if (req.sendData.message === 'ok') {
      res.status(200).send({ message: 'ok' });
    } else if (req.sendData.message === 'insufficient parameters') {
      res.status(400).send({ message: 'insufficient parameters' });
    } else if (req.sendData.message === 'no exists category name') {
      res.status(404).send({ message: 'no exists category name' });
    } else {
      res.status(500).send({ message: 'err' });
    }
  },
};

export default categoryController;
