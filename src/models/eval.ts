import {
    Schema,
    Model,
    Document,
    model as mongooseModel
  } from 'mongoose';
  
  // MAIN INTERFACE
  export interface IEval {
    question: string;
    type: string;
  }
  
  // DOCUMENT INTERFACE, DEFINE CUSTOM METHODS HERE
  export interface IEvalDoc extends Document, IEval {
    
  }
  
  // MODEL INTERFACE, DEFINE CUSTOM STATIC METHODS HERE
  interface IEvalModel extends Model<IEvalDoc> {
    
  }
  
  // SCHEMA DEFINITION
  const evalSchema = new Schema<IEvalDoc>({
    question: {
      type: String,
      required: true,
      minlength: 1,
      maxlength:200
    },
    type: {
      type: String,
      required: false,
      enum: [ 'material', 'teacher', 'documentation' ]
    }
  });

  // MODEL GENERATION
  export const EvalModel = mongooseModel<IEvalDoc, IEvalModel>('evals', evalSchema);
  