import * as express from 'express';
import { Request, Response } from 'express';
import { UserModel, IFormation } from '../models';
import { Types } from 'mongoose';
import {
  httpError400,
  httpError401,
  httpError404,
  mongoError
} from '../helpers/http';

export const userRouter = express.Router();

/*******************************************************************
*******  ADD A TRAINING FROM A USER                          *******
********************************************************************/
userRouter.post( '/:id/formations', ( req: Request, res: Response ) => {
  const userId = Types.ObjectId( req.params.id );
  const formation: IFormation = req.body;
  console.log( 'Update user ' + userId );
  console.log( formation );
  UserModel.findByIdAndUpdate(userId,
                              { $push: { course: formation } },
                              { new: true, runValidators: true } )
           .then( ( user ) => res.send( { user } ) )
           .catch( err => mongoError( err, res ) );
} );

/*******************************************************************
*******  UPDATE A TRAINING FROM A USER                       *******
********************************************************************/
userRouter.put( '/:id/formations/:fid', ( req: Request, res: Response ) => {
  const userId = Types.ObjectId( req.params.id );
  const formId = Types.ObjectId( req.params.fid );

  const fieldsToUpdate: any = req.body;

  const set = {};
  for (const key in fieldsToUpdate) {
    // RETURNS A BOOLEAN INDICATING WHETHER THE OBJECT HAS THE SPECIFIED PROPERTY
    if ( fieldsToUpdate.hasOwnProperty( key ) )
      set[ 'course.$.' + key ] = fieldsToUpdate[ key ];
  }
  console.log( set );
  UserModel.findOneAndUpdate( { _id: userId, 'course._id': formId },
                    { $set: set },
                    { new: true, runValidators: true } )
           .then( ( user ) => res.send( { user } ) )
           .catch( err => mongoError( err, res ) );
} );

/*******************************************************************
*******  DELETE A TRAINING FROM A USER                       *******
********************************************************************/
userRouter.delete( '/:id/formations/:fid', ( req: Request, res: Response ) => {
  const userId = Types.ObjectId( req.params.id );
  const formId = Types.ObjectId( req.params.fid );

  UserModel.findOneAndUpdate( { _id: userId, 'course._id': formId },
                    { $pull: { course: { _id: formId }} },
                    { new: true, runValidators: true } )
           .then( ( user ) => res.send( { user } ) )
           .catch( err => mongoError( err, res ) );
} );
