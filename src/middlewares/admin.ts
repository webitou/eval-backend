import { Request, Response } from 'express';
import * as  jwt from 'jsonwebtoken';
import { IRequestWithPayload, ITokenPayload } from '../models';
import { httpError403 } from '../helpers';



export const adminMiddleware = (req: IRequestWithPayload, res: Response, next) => {
  const { admin = false } = req.tokenPayload;
  if (admin)
    return next();
  
  res.status(403).send(httpError403('Admin workspace'))
};
