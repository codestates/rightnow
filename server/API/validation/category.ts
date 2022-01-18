import { Request, Response, NextFunction } from 'express';
import { CustomRequest } from '../../type/type';
const dotenv: any = require('dotenv');
dotenv.config();

const db: any = require('../../models/index');

interface CategoryValidation {
  createCategory(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ): Promise<any>;
  readCategory(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ): Promise<any>;
  updateCategory(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ): Promise<any>;
  deleteCategory(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ): Promise<any>;
}

const categoryValidation: CategoryValidation = {
  /*
  카테고리 생성
  */
  async createCategory(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ): Promise<any> {
    try {
      const { name, user_num } = req.body;
      if (name && user_num) {
        const category: any = await db['Category'].findOne({
          where: { name },
        });
        if (!category) {
          db['Category'].create({
            name,
            user_num,
          });
          req.sendData = { message: 'ok' };
          next();
        } else {
          req.sendData = { message: 'already exists category name' };
          next();
        }
      } else {
        req.sendData = { message: 'insufficient parameters' };
        next();
      }
    } catch (e) {
      console.log(e);
      req.sendData = {
        message: 'err',
      };
      next();
    }
  },

  /*
  카테고리 목록 읽기
  */
  async readCategory(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ): Promise<any> {
    try {
      const categoryList: string[] = await db['Category'].findAll();
      req.sendData = {
        data: {
          categoryList: categoryList,
        },
        message: 'ok',
      };
      next();
    } catch (e) {
      console.log(e);
      req.sendData = {
        message: 'err',
      };
      next();
    }
  },

  /*
  카테고리 수정
  */
  async updateCategory(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ): Promise<any> {
    try {
      const { category_name, new_category_name, new_user_num } = req.body;
      const category: any = await db['Category'].findOne({
        where: { name: category_name },
      });
      if (!category_name || !new_category_name || !new_user_num) {
        req.sendData = { message: 'insufficient parameters' };
        next();
        return;
      }
      if (category) {
        await db['Category'].update(
          { name: new_category_name, user_num: new_user_num },
          { where: { name: category_name } },
        );
        req.sendData = { message: 'ok' };
        next();
      } else {
        req.sendData = { message: 'no exists category name' };
        next();
      }

      next();
    } catch (e) {
      console.log(e);
      req.sendData = {
        message: 'err',
      };
      next();
    }
  },

  /*
  카테고리 삭제
  */
  async deleteCategory(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ): Promise<any> {
    try {
      const { category_name } = req.body;
      const category: any = await db['Category'].findOne({
        where: { name: category_name },
      });
      if (!category) {
        req.sendData = { message: 'no exists category name' };
        next();
        return;
      }
      if (category_name) {
        db['Category'].destroy({
          where: { name: category_name },
        });
        req.sendData = { message: 'ok' };
        next();
      } else {
        req.sendData = { message: 'insufficient parameters' };
        next();
      }
    } catch (e) {
      console.log(e);
      req.sendData = {
        message: 'err',
      };
      next();
    }
  },
};

export default categoryValidation;
