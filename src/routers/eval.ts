import * as express from 'express';
import * as mongoose from 'mongoose';
import { Request, Response } from 'express';
import { authMiddleware } from '../middlewares';
import { ValidateId } from '../helpers';
import { adminMiddleware } from '../middlewares/admin';

export const evaluationRouter = express.Router();

// ACCESS EVALUATION
const rootHandler = (req: Request, res: Response) => {
  res.send({ message: 'list of eval API' });
};
evaluationRouter.get('/', rootHandler);

const getByIdHandler = (req: Request, res: Response) => {
  res.send({ message: 'Welcome to eval by id API' });
};
evaluationRouter.get('/:id', getByIdHandler);


const createHandler =  (req: Request, res: Response) => {
  res.send({ message: 'Welcome to create eval API' });
};
evaluationRouter.post('/', authMiddleware, adminMiddleware, createHandler);