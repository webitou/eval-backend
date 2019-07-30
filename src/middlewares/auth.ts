import { Response } from 'express';
import * as  jwt from 'jsonwebtoken';
import { IRequestWithPayload, ITokenPayload } from '../models';

export const authMiddleware = ( req: IRequestWithPayload, res: Response, next ) => {
  const token = req.header( 'Authorization' );

  try {
    const tokenPayload: ITokenPayload = jwt.verify( token, process.env.JWT_SECRET ) as any;
    // STORE TOKEN PAYLOAD TO REQUEST
    req.tokenPayload = tokenPayload; 
    // TOKEN VALID AND NOT EXPIRED
    next();
  }
  catch (e) {
    // TOKEN INVALID
    res.status( 401 ).send( { error: 401 } );
  }
};
