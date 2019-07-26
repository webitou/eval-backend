import * as express from 'express';
import * as mongoose from 'mongoose';
import { Request, Response } from 'express';
import { authMiddleware } from '../middlewares';
import { ValidateId } from '../helpers';

export const formationRouter = express.Router();


const rootHandler = (req: Request, res: Response) => {
  res.send({ message: 'Welcome to formation API' });
};
formationRouter.get('/', rootHandler);


