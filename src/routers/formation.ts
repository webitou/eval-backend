import * as express from 'express';
import * as mongoose from 'mongoose';
import { Request, Response } from 'express';
import { authMiddleware } from '../middlewares';
import { ValidateId } from '../helpers';
import { adminMiddleware } from '../middlewares/admin';

export const formationRouter = express.Router();

// ACCESS FORMATIONS
const rootHandler = (req: Request, res: Response) => {
  res.send({ message: 'Welcome to formation API' });
};
// formationRouter.get('/', authMiddleware, rootHandler);
formationRouter.get('/', rootHandler);

const getByIdHandler = (req: Request, res: Response) => {
  res.send({ message: 'Welcome to formation by id API' });
};
// formationRouter.get('/:id', authMiddleware, getByIdHandler);
formationRouter.get('/:id', getByIdHandler);


const createHandler =  (req: Request, res: Response) => {
  res.send({ message: 'Welcome to create formation API' });
};
formationRouter.post('/', authMiddleware, adminMiddleware, createHandler);