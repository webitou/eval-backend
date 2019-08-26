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

/*******************************************************************
*******  DISPLAY EVALUATION LIST                             *******
********************************************************************/
const rootHandler = ( req: Request, res: Response ) => {
  // res.send( { message: 'list of eval API' } );
  EvalModel
    .find()
    .then( evals => res.send( { evals } ) )
    .catch( err => httpError500( 'Cannot retrieve Evaluation', err ) );
};
evaluationRouter.get( '/', rootHandler );

/*******************************************************************
*******  DISPLAY EVALUATION WITH ID                          *******
********************************************************************/
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
evaluationRouter.get( '/:id', getByIdHandler ); // PROVISOIR

/*******************************************************************
*******  CREATE EVALUATION                                   *******
********************************************************************/
const createHandler =  ( req: Request, res: Response ) => {
  // res.send( { message: 'Welcome to create eval API' } );
  // 1. VALIDATE MISSING FORMATION DATA FROM req.body
  const { question, type } = req.body;
  if ( !question || !type )
    return res.status( 400 ).send( httpError400( 'All fields are required' ) );
  // 2. VALIDATE UNIQUENESS OF QUESTION
    EvalModel
      .findOne( { question } )
      .then( evals => {
        if ( evals ) {
          res.status( 400 ).send( httpError400( 'Formation already exists' ) );
          return;
        }
  // 3. CREATE MODEL INSTANCE USING req.body
  // VERIF ADMIN
        req.body.admin = false;
        const newEvaluation = new EvalModel( req.body );
  // 4. SAVE AND MANAGE VALIDATION ERRORS
        return newEvaluation.save();
      })
      .then(evals => {
        // pas oublier la reponse final
        res.status( 200 ).json( {evals} );
      })
      .catch( err => mongoError( err, res ) );
};
// evaluationRouter.post( '/', authMiddleware, adminMiddleware, createHandler );
evaluationRouter.post( '/', createHandler ); // PROVISOIR

/*******************************************************************
*******  UPDATE EVALUATION                                   *******
********************************************************************/
const updateHandler =  ( req: Request, res: Response ) => {
  const evalId = Types.ObjectId( req.params.id );
  console.log( evalId );
  console.log(req.body);

  EvalModel.findByIdAndUpdate( evalId, req.body )
  .then( ( evals ) => res.send( { evals } ) )
  .catch( err => mongoError( err, res ) );
      // console.log( 'Succesfully updated eval!' );
      // res.send( 'Succesfully updated eval!' );
};
// evaluationRouter.post('/', authMiddleware, adminMiddleware, updateHandler);
evaluationRouter.post( '/:id', updateHandler ); // PROVISOIR

/*******************************************************************
*******  DELETE EVALUATION                                   *******
********************************************************************/
const deleteHandler =  ( req: Request, res: Response ) => {
  const evalId = Types.ObjectId( req.params.id );
  console.log( evalId );

  EvalModel.deleteOne( { _id: evalId } )
      .then( ( evals ) => res.send( { evals } ) )
      .catch( err => mongoError( err, res ) );
      // console.log( 'Succesfully deleted eval!' );
      // res.send( 'Succesfully deleted eval!' );
};
// evaluationRouter.delete('/', authMiddleware, adminMiddleware, deleteHandler);
evaluationRouter.delete( '/:id', deleteHandler ); // PROVISOIR
