import {
    Schema,
    Model,
    Document,
    model as mongooseModel
  } from 'mongoose';
  
  // main interface
  export interface IFormation {
    title: string;
  }
  
  // document interface, define custom methods here
  export interface IFormationDoc extends Document, IFormation {
    
  }
  
  // model interface, define custom static methods here
  interface IFormationModel extends Model<IFormationDoc> {
    
  }
  
  // schema definition
  const formationSchema = new Schema<IFormationDoc>({
    title: {
      type: String,
      required: true,
      minlength: 1,
      maxlength:200
    },
  });

  
  
  // model generation
  export const FormationModel = mongooseModel<IFormationDoc, IFormationModel>('formations', formationSchema);
  