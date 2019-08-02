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
  MgmFormationModel
    .find()
    .then( formations => res.send( { formations } ) )
    .catch(err => httpError500( 'Cannot retrieve formations', err ) );
};
// formationRouter.get('/', authMiddleware, rootHandler);
mgmFormationRouter.get( '/', rootHandler ); // PROVISOIR

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
// formationRouter.get('/:id', authMiddleware, getByIdHandler);
mgmFormationRouter.get( '/:id', getByIdHandler ); // PROVISOIR

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
    .catch( err => mongoError( err, res ) );
};
// formationRouter.post('/', authMiddleware, adminMiddleware, createHandler);
mgmFormationRouter.post( '/', createHandler ); // PROVISOIR

/*******************************************************************
*******  UPDATE TRAINING               NOK                      *******
********************************************************************/
const updateHandler =  ( req: Request, res: Response ) => {
  const formId = Types.ObjectId( req.params.id );
  const fieldsToUpdate: any = req.body;
  console.log( formId );

  const set = {};
  for ( const key in fieldsToUpdate ) {
    // RETURNS A BOOLEAN INDICATING WHETHER THE OBJECT HAS THE SPECIFIED PROPERTY
    if ( fieldsToUpdate.hasOwnProperty( key ) )
      set[ 'formations.$.' + key ] = fieldsToUpdate[ key ];
  }
  console.log( set );
  MgmFormationModel.findOne( { 'formations._id': formId },
                    { $set: set },
                    { new: true, runValidators: true } )
           .then( ( formations ) => res.send( { formations } ) )
           .catch( err => mongoError( err, res ) );
};
// formationRouter.post('/', authMiddleware, adminMiddleware, createHandler);
mgmFormationRouter.post( '/:id', updateHandler ); // PROVISOIR

/*******************************************************************
*******  DELETE TRAINING                                     *******
********************************************************************/
mgmFormationRouter.delete( '/:id', ( req: Request, res: Response ) => {

  const formId = Types.ObjectId( req.params.id );
  // const formId = '5d3eb79394c95443e1b4340f';
  console.log( formId );

  MgmFormationModel.deleteOne( { _id: formId } )
      .then( ( formations ) => res.send( { formations } ) )
      .catch( err => mongoError( err, res ) );
      console.log( 'Deleted formation' );
});
