import {
  Schema,
  Model,
  Document,
  model as mongooseModel
} from 'mongoose';
import { Request } from 'express';

import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

import { formationSchema } from './formation';

export interface ITokenPayload {
  user_id: string;
  admin: boolean;
}
export interface IRequestWithPayload extends Request {
  tokenPayload?: ITokenPayload;
}

// MAIN INTERFACE
export interface IUser {
  email: string;
  password: string;
  fullname: string;
  lastLogin: number;
  language: string;
  admin: boolean;
  course: {
    reference: String,
    title: String,
    dateStart: Date,
    dateEnd: Date,
    dayWeek: string,
    confirm: boolean   // The administrator must confirm for the user to be able to make the evaluation
  };
}

// DOCUMENT INTERFACE, DEFINE CUSTOM METHODS HERE
export interface IUserDoc extends Document, IUser {
  comparePassword(password: string): boolean;
  getToken(): string;
}

// MODEL INTERFACE, DEFINE CUSTOM STATIC METHODS HERE
interface IUserModel extends Model<IUserDoc> {
  hashPassword(password: string): string;
}

// SCHEMA DEFINITION
const userSchema = new Schema<IUserDoc>({
  email: {
    type: String,
    required: true,
    match: /^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gim
  },
  password: {
    type: String,
    required: true,
    minLength: 59,
    maxLength: 60,
  },
  fullname: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 100,
  },
  language: {
    type: String,
    required: true,
    minlength: 2
  },
  lastLogin: {
    type: Number,
    required: true,
    min: 1000000000,
    default: Date.now // !!!! !== of Date.now(), Date.now() give to value once at execution time
                      // With Date.now, we assign a function, which will be callede each time we
                      // need the default value
  },
  admin: {
    type: Boolean,
    required: true,
    default: false,
  },
  course: {
    type: [ formationSchema ],
    required: true,
    default: []
  }
});

// INDEX USED FOR INSERT/UPDATE TO ENSURE UNIQUNESS OF EMAIL ADDRESS
userSchema.index({ email: 1 }, { unique: true });
// INDEX USED FOR SEARCH BY EMAIL, SINCE WE SEARCH FOR EXACT VALUE
userSchema.index({ email: 'hashed' });

// MODEL CUSTOM METHODS
// THIS IS AN INSTANCE IUserDoc
userSchema.method( 'comparePassword', function ( this: IUserDoc, password: string ) {
  try {
    return bcrypt.compareSync( password, this.password );
  }
  catch ( e ) { }
  return false;
} );


userSchema.method( 'getToken', function ( this: IUserDoc ) {
  return jwt.sign( {
      userId: this._id.toString(),
      admin: this.admin,
    },
    process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  } );
} );

// OVERRIDE TOJSON TO REMOVE PASSWORD BEFORE SENDING RESPONSE
userSchema.method( 'toJSON', function ( this: IUserDoc ) {
  const obj = this.toObject();
  delete obj.password;
  return obj;
} );

// MODEL CUSTOM STATIC METHODS
//
// cannot use this here
//
// allow to do:
// MovieModel.staticMethod();
userSchema.static( 'hashPassword', ( password: string ): string => {
  return bcrypt.hashSync( password, +process.env.BCRYPT_ROUNDS );
} );

// MODEL GENERATION
export const UserModel = mongooseModel< IUserDoc, IUserModel >( 'users', userSchema );
