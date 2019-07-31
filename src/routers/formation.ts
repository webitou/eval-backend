import * as express from 'express';
import { Request, Response } from 'express';
import { authMiddleware } from '../middlewares';
import { adminMiddleware } from '../middlewares/admin';
import {
  httpError500,
  httpError404,
  httpError400,
  mongoError
} from '../helpers';
import { UserModel } from '../models';
import { escapeRegExp } from '../helpers/regexp';

export const formationRouter = express.Router();

// LIST FORMATIONS SEARCH
const searchHandler = ( req: Request, res: Response ) => {
  const searchs = req.query.q.split(' ').filter( str => str );
  const mongoSearch = {};

  const regexps = searchs.map(str => (new RegExp(escapeRegExp(str), 'i')));
  if ( regexps.length === 1 )
    mongoSearch[ 'course.title' ] = regexps[ 0 ];
  else if ( regexps.length > 1 )
    mongoSearch[ '$and' ] = regexps.map( reg => ( { 'course.title': reg } ) );

    console.log( mongoSearch );

  UserModel
    .aggregate( [ {
        $unwind: {
          path: '$course',
          preserveNullAndEmptyArrays: false
        }
      }, {
        $match: mongoSearch
      }]).exec()
      .then( users => users.map( u => u.course ) )
      .then( formations => res.send( { formations } ) )
      .catch( err => httpError500( 'Cannot retrieve formations', err ) );

  // METHOD WITHOUT AGGREGATE
  // UserModel
  //   .find( mongoSearch , { course: 1, _id: 0 })
  //   .then(users => users.map(u => u.course))
  //   .then(formations => res.send( { formations } ) )
  //   .catch(err => httpError500('Cannot retrieve formations', err));
};
// formationRouter.get('/', authMiddleware, rootHandler);
formationRouter.get( '/', searchHandler ); // PROVISOIR

// A VOIR 
// https://docs.mongodb.com/manual/reference/operator/aggregation/replaceRoot/index.html
