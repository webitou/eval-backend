import {
  Schema,
  Model,
  Document,
  model as mongooseModel
} from 'mongoose';
import { ValidateInteger } from '../helpers';

// MAIN INTERFACE
export interface IMgmFormation {
  title: string;
  reference: string;
  dateStart: Date;
  dateEnd: Date;
  dayWeek: number;
  timeStart: string;
  timeEnd: string;
  teacher: string;
  description: string;
  objectif: string;
  content: string;
  prerequisites: string;
  evals: [
    {
      userId: String,
      ratting: [
        {
          q_index: Number,
          r_value: Number
        }
      ]
    }
   ]
}

// DOCUMENT INTERFACE, DEFINE CUSTOM METHODS HERE
export interface IMgmFormationDoc extends Document, IMgmFormation {

}

// MODEL INTERFACE, DEFINE CUSTOM STATIC METHODS HERE
interface IMgmFormationModel extends Model< IMgmFormationDoc > {

}

// SCHEMA DEFINITION
const mgmFormationSchema = new Schema< IMgmFormationDoc >( {
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
    max: 8,
    validate: [ ValidateInteger, 'Day week must be an interger' ]
  },
  timeStart: {
    type: String,
    required: true,
  },
  timeEnd: {
    type: String,
    required: true,
  },
  teacher: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  objectif: {
    type: String,
    required: false
  },
  content: {
    type: String,
    required: false
  },
  prerequisites: {
    type: String,
    required: false
  },
  evals: [ new Schema({
      userId: {type: String, required: true},
      ratting: [
        {
          q_index: Number,
          r_value: Number
        }
      ]
    })
   ]
});
mgmFormationSchema.index( { reference: 1 }, { unique: true } );

// MODEL GENERATION
export const MgmFormationModel = mongooseModel< IMgmFormationDoc, IMgmFormationModel >( 'formations', mgmFormationSchema );
