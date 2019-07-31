import {
    Schema,
    Model,
    Document,
    model as mongooseModel
  } from 'mongoose';
import { ValidateInteger } from '../helpers';

  // MAIN INTERFACE
  export interface IFormation {
    title: string;
    reference: string;
    dateStart: Date;
    dateEnd: Date;
    dayWeek: number;
  }

  // DOCUMENT INTERFACE, DEFINE CUSTOM METHODS HERE
  export interface IFormationDoc extends Document, IFormation {

  }

  // MODEL INTERFACE, DEFINE CUSTOM STATIC METHODS HERE
  interface IFormationModel extends Model< IFormationDoc > {

  }

  // SCHEMA DEFINITION
 export const formationSchema = new Schema< IFormationDoc >( {
    title: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 200,
    },
    reference: {
      type: String,
      required: false,
    },
    dateStart: {
      type: Date,
      required: true,
    },
    dateEnd: {
      type: Date,
      required: true,
    },
    dayWeek: {
      type: Number,
      required: true,
      min: 0,
      max: 6,
      validate: [ ValidateInteger, 'Day week must be an interger' ]
    }
  });
  formationSchema.index( { reference: 1 }, { unique: true } );
