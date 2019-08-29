import * as express from 'express';
import { Types } from 'mongoose';
import { Request, Response } from 'express';
import { authMiddleware } from '../middlewares';
import { adminMiddleware } from '../middlewares/admin';
import {
  httpError500,
  httpError404,
  httpError400,
  mongoError
} from '../helpers';
import { MgmFormationModel } from '../models/manage-formation';
import { Db } from 'mongodb';

export const mgmFormationRouter = express.Router();
/*******************************************************************
*******  LIST FORMATIONS                                     *******
********************************************************************/
const rootHandler = ( req: Request, res: Response ) => {
  // get user info:
  // console.log('XXXXXX', (req as any).tokenPayload);

  MgmFormationModel
    .find()
    .then( formations => res.send( { formations } ) )
    .catch(err => httpError500( 'Cannot retrieve formations', err ) );
};
mgmFormationRouter.get( '/', rootHandler );

/*******************************************************************
*******  GET FORMATION BY ID                                 *******
********************************************************************/
const getByIdHandler = ( req: Request, res: Response ) => {
  MgmFormationModel
    // .findById( Types.ObjectId( req.param( 'id' ) ) )
    .findById ( Types.ObjectId( req.params.id ) )
    .then( formation => {
      if ( formation )
        res.send( { formation } );
      else
        // res.status( 404 ).send( httpError404( `Formation not found with id ${ req.param( 'id' ) }` ) );
        res.status( 404 ).send( httpError404( `Formation not found with id ${ req.params.id }` ) );
    })
    // .catch(err => httpError500( `Cannot retrieve formation with id ${ req.param( 'id' ) }`, err ) );
    .catch(err => httpError500( `Cannot retrieve formation with id ${ req.params.id }`, err ) );
};
mgmFormationRouter.get( '/:id', getByIdHandler );

/*******************************************************************
*******  ADD FORMATION                                       *******
********************************************************************/
const createHandler =  ( req: Request, res: Response ) => {
  // 1. VALIDATE MISSING FORMATION DATA FROM req.body
    const { title, reference, dateStart, dateEnd, dayWeek } = req.body;
    if (!title || !reference || !dateStart || !dateEnd || !dayWeek )
      return res.status( 400 ).send( httpError400( `All fields are required` ) );
  // 2. VALIDATE UNIQUENESS OF REFERENCE
  MgmFormationModel
    .findOne( { reference } )
    .then( formations => {
      if ( formations ) {
        res.status( 400 ).send( httpError400( 'Formation already exists' ) );
        return;
      }
      // 3. CREATE MODEL INSTANCE USING req.body
      // VERIF ADMIN
      req.body.admin = false;
      const newFormation = new MgmFormationModel( req.body );
      // 4. SAVE AND MANAGE VALIDATION ERRORS
      return newFormation.save();
    })
    .then(formation => {
      // pas oublier la reponse final
      res.status( 200 ).json( {formation} );
    })
    .catch( err => mongoError( err, res ) );
};
// mgmFormationRouter.post('/', authMiddleware, adminMiddleware, createHandler);
mgmFormationRouter.post( '/', createHandler ); // PROVISOIR

/*******************************************************************
*******  UPDATE FORMATION                                    *******
********************************************************************/
const updateHandler =  ( req: Request, res: Response ) => {
  const formId = Types.ObjectId( req.params.id );
  console.log( formId );
  console.log(req.body);

  MgmFormationModel.findByIdAndUpdate( formId, req.body )
  .then( ( formations ) => res.send( { formations } ) )
  .catch( err => mongoError( err, res ) );
      // console.log( 'Succesfully updated formation!' );
      // res.send( 'Succesfully updated formation!' );
};
// mgmFormationRouter.post('/', authMiddleware, adminMiddleware, updateHandler);
mgmFormationRouter.post( '/:id', updateHandler ); // PROVISOIR

/*******************************************************************
*******  DELETE TRAINING                                     *******
********************************************************************/
const deleteHandler =  ( req: Request, res: Response ) => {
  const formId = Types.ObjectId( req.params.id );
  console.log( formId );

  MgmFormationModel.deleteOne( { _id: formId } )
      .then( ( formations ) => res.send( { formations } ) )
      .catch( err => mongoError( err, res ) );
      // console.log( 'Succesfully deleted formation!' );
      // res.send( 'Succesfully deleted formation!' );
};
// mgmFormationRouter.delete('/', authMiddleware, adminMiddleware, deleteHandler);
mgmFormationRouter.delete( '/:id', deleteHandler ); // PROVISOIR

/*******************************************************************
*******  ADD EVAL TO FORMATION                               *******
********************************************************************/
const updateEvalHandler =  ( req: Request, res: Response ) => {
  const formId = Types.ObjectId( req.params.id );
  console.log( formId );
  console.log(req.body);

  MgmFormationModel.findByIdAndUpdate( formId, req.body )
  .then( ( formations ) => res.send( { formations } ) )
  .catch( err => mongoError( err, res ) );
      // console.log( 'Succesfully updated formation!' );
      // res.send( 'Succesfully updated formation!' );
};
// mgmFormationRouter.post('/', authMiddleware, adminMiddleware, updateHandler);
mgmFormationRouter.post( '/:id/eval', updateEvalHandler ); // PROVISOIR
