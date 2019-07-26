import * as mongoose from 'mongoose';
import { Mongoose } from 'mongoose';

// REMOVE DEPRECATED WARNING
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

export class Database {
  private db: Mongoose = mongoose; // MONGOOSE IS AN INSTANCE OF CLASS Mongoose

  constructor(
    private uri: string
  ) { }

  connect() {
    console.log( 'Connecting database to ' + this.uri );
    return this.db
               .connect( this.uri, { useNewUrlParser: true } )
               .then( mongooseConnected => {
                 console.log( 'Database connected to ' + this.uri );
                 return mongooseConnected;
               });
  }

  disconnect() {
    return this.db.disconnect();
  }
}
