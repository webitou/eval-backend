import * as express from 'express';
import { Request, Response } from 'express';
import { UserModel, IFormation } from '../models';
import { Types } from 'mongoose';
import {
  httpError400,
  httpError401,
  httpError404,
  mongoError,
  httpError500
} from '../helpers/http';

export const userRouter = express.Router();

/*******************************************************************
*******  DISPLAY USERS LIST                                  *******
********************************************************************/
const rootHandler = ( req: Request, res: Response ) => {
  // res.send( { message: 'list of user API' } );
  UserModel
    .find()
    .then( users => res.send( { users } ) )
    .catch( err => httpError500( 'Cannot retrieve Users', err ) );
};
userRouter.get( '/', rootHandler );

/*******************************************************************
*******  GET USER BY ID                                      *******
********************************************************************/
const getByIdHandler = ( req: Request, res: Response ) => {
  UserModel
    // .findById( Types.ObjectId( req.param( 'id' ) ) )
    .findById ( Types.ObjectId( req.params.id ) )
    .then( user => {
      if ( user )
        res.send( { user } );
      else
        // res.status( 404 ).send( httpError404( `Formation not found with id ${ req.param( 'id' ) }` ) );
        res.status( 404 ).send( httpError404( `user not found with id ${ req.params.id }` ) );
    })
    // .catch(err => httpError500( `Cannot retrieve formation with id ${ req.param( 'id' ) }`, err ) );
    .catch(err => httpError500( `Cannot retrieve user with id ${ req.params.id }`, err ) );
};
// userRouter.get('/:id', authMiddleware, getByIdHandler);
userRouter.get( '/:id', getByIdHandler );

/*******************************************************************
*******  UPDATE USER                                         *******
********************************************************************/
const updateHandler =  ( req: Request, res: Response ) => {
  const userId = Types.ObjectId( req.params.id );
  console.log( userId );
  console.log(req.body);

  UserModel.findByIdAndUpdate( userId, req.body )
  .then( ( users ) => res.send( { users } ) )
  .catch( err => mongoError( err, res ) );
      // console.log( 'Succesfully updated eval!' );
      // res.send( 'Succesfully updated eval!' );
};
// userRouter.post('/', authMiddleware, adminMiddleware, updateHandler);
userRouter.post( '/:id', updateHandler ); // PROVISOIR

/*******************************************************************
*******  DELETE USER                                         *******
********************************************************************/
const deleteHandler =  ( req: Request, res: Response ) => {
  const userId = Types.ObjectId( req.params.id );
  console.log( userId );

  UserModel.deleteOne( { _id: userId } )
      .then( ( user ) => res.send( { user } ) )
      .catch( err => mongoError( err, res ) );
};
// userRouter.delete('/', authMiddleware, adminMiddleware, deleteHandler);
userRouter.delete( '/:id', deleteHandler ); // PROVISOIR

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
