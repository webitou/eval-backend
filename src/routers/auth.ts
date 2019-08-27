import * as express from 'express';
import { Request, Response } from 'express';
import { UserModel } from '../models';
import {
  httpError400,
  httpError401,
  mongoError
} from '../helpers/http';
import { authMiddleware } from '../middlewares';

export const authRouter = express.Router();

/*******************************************************************
*******  LOGIN USER                                          *******
********************************************************************/
const signinHandler = ( req: Request, res: Response ) => {
  const { email, password } = req.body;

  // 1. VALIDATE MISSING DATA
  if ( !email || !password )
    return res.status( 401 ).send( httpError401( 'Email or password are missing' ) );

  // 2. GET USER BY EMAIL
  UserModel
    .findOne( { email } )
    .then( user => {
      // 3. VALIDATE PASSWORD
      if ( !user || !user.comparePassword( password ) ) {
        res.status( 401 ).send( httpError401( 'Wrong email or password' ) );
        return;
      }
      // 4. UPDATE LASTLOGIN
      return UserModel.findByIdAndUpdate(
        user._id, // WHAT WE UPDATE
        { $set: { lastLogin: Date.now() } }, // UPDATE DETAILS
        { new: true, runValidators: true } // UPDATE OPTIONS: RUN VALIDATIONS AND RETURN MODIFIED DOCUMENT
      )
      // 5. USER SUCCESSFULLY LOGGED, RETURN USER AND TOKEN
      .then( user => res.send( { user, token: user.getToken(), error: false } ) );
    })
    .catch( err => mongoError( err, res ) );
};
authRouter.post( '/signin', signinHandler );

/*******************************************************************
*******  CREATE NEW USER                                     *******
********************************************************************/
const signupHandler = ( req: Request, res: Response ) => {
  // 1. VALIDATE MISSING USER DATA FROM req.body
  const { email, password, language, fullname, course } = req.body;
  if ( !email || !password || !language || !fullname )
    return res.status( 400 ).send( httpError400( `All fields are required` ) );
  // 2. VALIDATE UNIQUENESS OF EMAIL
  UserModel
    .findOne( { email } )
    .then( user => {
      if (user) {
        res.status( 400 ).send( httpError400( 'User already exists' ) );
        return;
      }
      // 3. CREATE MODEL INSTANCE USING req.body
      // VERIF ADMIN
      req.body.admin = false;
      const newUser = new UserModel( req.body );
      // 4. HASH PASSWORD
      newUser.password = UserModel.hashPassword( password );
      // 5. SAVE AND MANAGE VALIDATION ERRORS
      return newUser.save();
    })
    .then( user => {
      // 5. GENERATE USER TOKEN
      const token = user.getToken();
      // 6. RETURN COMPLETE USER OBJECT WITH TOKEN
      res.send( { user, error: false, token } );
    })
    .catch( err => mongoError( err, res ) );
};
authRouter.post( '/signup', signupHandler );
authRouter.get('/isAuth', [authMiddleware], (req, res) => {
  // if blablabla
      res.send({ auth: true, user: req.tokenPayload });
  // // else
  //     res.status(401).send(http_1.httpError401('You are not logged in...'));
});
