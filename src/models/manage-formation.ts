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
    max: 6,
    validate: [ ValidateInteger, 'Day week must be an interger' ]
  }
});
mgmFormationSchema.index( { reference: 1 }, { unique: true } );

// MODEL GENERATION
export const MgmFormationModel = mongooseModel< IMgmFormationDoc, IMgmFormationModel >( 'formations', mgmFormationSchema );
