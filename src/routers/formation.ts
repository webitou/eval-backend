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
import { FormationModel } from '../models';

export const formationRouter = express.Router();

// ACCESS FORMATIONS
const rootHandler = ( req: Request, res: Response ) => {
  FormationModel
    .find()
    .then(formations => res.send( { formations } ) )
    .catch(err => httpError500('Cannot retrieve formations', err));
};
// formationRouter.get('/', authMiddleware, rootHandler);
formationRouter.get( '/', rootHandler ); // PROVISOIR

const getByIdHandler = ( req: Request, res: Response ) => {
  FormationModel
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
formationRouter.get( '/:id', getByIdHandler ); // PROVISOIR


const createHandler =  ( req: Request, res: Response ) => {
  // 1. VALIDATE MISSING FORMATION DATA FROM req.body
    const { title, reference, dateStart, dateEnd, dayWeek } = req.body;
    if (!title || !reference || !dateStart || !dateEnd || !dayWeek )
      return res.status( 400 ).send( httpError400( 'All fields are required' ) );
  // 2. VALIDATE UNIQUENESS OF REFERENCE
  FormationModel
    .findOne( { reference } )
    .then( formations => {
      if ( formations ) {
        res.status( 400 ).send( httpError400( 'Formation already exists' ) );
        return;
      }
  // 3. CREATE MODEL INSTANCE USING req.body
  // VERIF ADMIN
      req.body.admin = false;
      const newFormation = new FormationModel( req.body );
  // 4. SAVE AND MANAGE VALIDATION ERRORS
      return newFormation.save();
    })
    .catch( err => mongoError( err, res ) );
};
// formationRouter.post('/', authMiddleware, adminMiddleware, createHandler);
formationRouter.post( '/', createHandler ); // PROVISOIR
