import {
  Schema,
  Model,
  Document,
  model as mongooseModel
} from 'mongoose';
import { Request } from 'express';

import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

export interface ITokenPayload { 
  user_id: string; 
  admin: boolean 
}
export interface IRequestWithPayload extends Request {
  tokenPayload?: ITokenPayload;
}

// main interface
export interface IUser {
  email: string;
  password: string;
  fullname: string;
  lastLogin: number;
  admin: boolean;
}

// document interface, define custom methods here
export interface IUserDoc extends Document, IUser {
  comparePassword(password: string): boolean;
  getToken(): string;
}

// model interface, define custom static methods here
interface IUserModel extends Model<IUserDoc> {
  hashPassword(password: string): string;
}

// schema definition
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
  }
});
// index used for insert/update to ensure uniquness of email address
userSchema.index({ email: 1 }, { unique: true });
// index used for search by email, since we search for exact value
userSchema.index({ email: 'hashed' });

// Model custom methods
//
// this is an instance IMovieDoc
//
// allow to do:
// const movie = new MovieModel({...});
// movie.setLanguage('Français');
userSchema.method('comparePassword', function (this: IUserDoc, password: string) {
  try {
    return bcrypt.compareSync(password, this.password);
  }
  catch (e) { }
  return false;
});


userSchema.method('getToken', function (this: IUserDoc) {
  return jwt.sign({
      userId: this._id.toString(),
      admin: this.admin,
    },
    process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
});

// override toJSON to remove password before sending response
userSchema.method('toJSON', function (this: IUserDoc) {
  const obj = this.toObject();
  delete obj.password;
  return obj;
});

// Model custom static methods
//
// cannot use this here
//
// allow to do:
// MovieModel.staticMethod();
userSchema.static('hashPassword', (password: string): string => {
  return bcrypt.hashSync(password, +process.env.BCRYPT_ROUNDS);
});


// model generation
export const UserModel = mongooseModel<IUserDoc, IUserModel>('users', userSchema);
