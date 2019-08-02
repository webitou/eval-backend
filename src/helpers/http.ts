import { Error } from 'mongoose';
import { Response } from 'express';

const httpError = ( status: number, msg = '' ) => ( message = msg, err = undefined ) => ( {
  error: true,
  err,
  status,
  message
} );

// const httpErrorExplained = (status) => {
//
//   const httpErrorFunction = (message) => {
//
//     return  {
//       error: true,
//       status,
//       message
//     };
//
//   };
//
//   return httpErrorFunction;
//
// };

/*******************************************************************
*******  BAD REQUEST                                         *******
********************************************************************/
export const httpError400 = httpError( 400 );
/*******************************************************************
*******  UNAUTHORIZED                                        *******
********************************************************************/
export const httpError401 = httpError( 401 );
/*******************************************************************
*******  FORBIDDEN                                           *******
********************************************************************/
export const httpError403 = httpError( 403 );
/*******************************************************************
*******  NOT FOUND                                           *******
********************************************************************/
export const httpError404 = httpError( 404 );
/*******************************************************************
*******  ERRORS NOT MANAGED                                  *******
********************************************************************/
export const httpError500 = httpError( 500, 'Internal Server Error' );
/*******************************************************************
*******  ERRORS MONGO MANAGED                                *******
********************************************************************/
export const mongoError = ( err, res: Response ) => {
  if ( err instanceof Error.ValidationError )
    res.status( 400 ).send( httpError400( 'Validation error', err ) );
  else
    res.status( 500 ).send( httpError500( undefined, err ) );
};
