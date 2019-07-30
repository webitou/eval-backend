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
import { EvalModel } from '../models';

export const evaluationRouter = express.Router();

// DISPLAY EVALUATION LIST
const rootHandler = ( req: Request, res: Response ) => {
  // res.send( { message: 'list of eval API' } );
  EvalModel
    .find()
    .then( evals => res.send( { evals } ) )
    .catch( err => httpError500( 'Cannot retrieve Evaluation', err ) );
};
evaluationRouter.get( '/', rootHandler );

// DISPLAY EVALUATION WITH ID
const getByIdHandler = ( req: Request, res: Response ) => {
  // res.send({ message: 'Welcome to eval by id API' });
  EvalModel
    // .findById( Types.ObjectId( req.param( 'id' ) ) )
    .findById ( Types.ObjectId( req.params.id ) )
    .then( evaluation => {
      if ( evaluation )
        res.send( { evaluation } );
      else
        res.status( 404 ).send( httpError404( `Evaluation not found with id ${ req.params.id }` ) );
    })
    .catch(err => httpError500( `Cannot retrieve evaluation with id ${ req.params.id }`, err ) );
};
// evaluationRouter.get('/:id', authMiddleware, getByIdHandler);
evaluationRouter.get( '/:id', getByIdHandler );


const createHandler =  ( req: Request, res: Response ) => {
  // res.send( { message: 'Welcome to create eval API' } );
  // 1. Validate missing formation data from req.body
  const { question, type } = req.body;
  if ( !question || !type )
    return res.status( 400 ).send( httpError400( 'All fields are required' ) );
  // 2. Validate uniqueness of reference
    EvalModel
      .findOne( { question } )
      .then( evals => {
        if ( evals ) {
          res.status( 400 ).send( httpError400( 'Formation already exists' ) );
          return;
        }
  // 3. Create Model instance using req. body
  // VERIF ADMIN
        req.body.admin = false;
        const newEvaluation = new EvalModel( req.body );
  // 4. Save and manage validation errors
        return newEvaluation.save();
      })
      .catch( err => mongoError( err, res ) );
};
// evaluationRouter.post( '/', authMiddleware, adminMiddleware, createHandler );
evaluationRouter.post( '/', createHandler );

