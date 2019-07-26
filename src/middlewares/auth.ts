import { Request, Response } from 'express';
import * as  jwt from 'jsonwebtoken';
import { IRequestWithPayload, ITokenPayload } from '../models';



export const authMiddleware = (req: IRequestWithPayload, res: Response, next) => {
  const token = req.header('Authorization');

  try {
    const tokenPayload: ITokenPayload = jwt.verify(token, process.env.JWT_SECRET) as any;
    // store token payload to request
    req.tokenPayload = tokenPayload; 
    // token valid & not expired
    next();
  }
  catch (e) {
    // token invalid
    res.status(401).send({ error: 401 });
  }
};
