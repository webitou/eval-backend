import {
    Schema,
    Model,
    Document,
    model as mongooseModel
  } from 'mongoose';
  
  // MAIN INTERFACE
  export interface IFormation {
    title: string;
  }
  
  // DOCUMENT INTERFACE, DEFINE CUSTOM METHODS HERE
  export interface IFormationDoc extends Document, IFormation {
    
  }
  
  // MODEL INTERFACE, DEFINE CUSTOM STATIC METHODS HERE
  interface IFormationModel extends Model<IFormationDoc> {
    
  }
  
  // SCHEMA DEFINITION
  const formationSchema = new Schema<IFormationDoc>({
    title: {
      type: String,
      required: true,
      minlength: 1,
      maxlength:200
    },
    nbformation: {
      type: String,
      required: false,
    }
  });

  // MODEL GENERATION
  export const FormationModel = mongooseModel<IFormationDoc, IFormationModel>('formations', formationSchema);
  