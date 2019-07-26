import { Response } from 'express';
import { IRequestWithPayload } from '../models';
import { httpError403 } from '../helpers';

// CONTROL USER ADMIN ACCESS
export const adminMiddleware = (req: IRequestWithPayload, res: Response, next) => {
  const { admin = false } = req.tokenPayload;
  if (admin)
    return next();
  
  res.status( 403 ).send( httpError403( 'Admin workspace' ) )
};
