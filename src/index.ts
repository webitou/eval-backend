import * as express from 'express';
import * as bodyParser from 'body-parser';

import * as morgan from 'morgan';
import * as helmet from 'helmet';
import * as hpp from 'hpp';
import * as cors from 'cors';
import * as compress from 'compression';
import * as cookieParser from 'cookie-parser';
import { authRouter, rootRouter, formationRouter } from './routers';
import * as dotenv from 'dotenv';
import { notFoundMiddleware, errorMiddleware } from './middlewares/error';
import { Database } from './database';

// LOAD .env VARIABLES INTO process.env
dotenv.config();

const PORT = +process.env.PORT || +process.env.EXPRESS_PORT;
const HOST = process.env.HOST || process.env.EXPRESS_HOST;

const MONGO_URI = process.env.MONGO_URI;
const database: Database = new Database(MONGO_URI);
database
.connect()
.then(_ => {
  // APP
  const app = express();

  // MIDDLEWARES
    // USE BODYPARSER TO PARSE JSON
  app.use(bodyParser.json())
    // USE HELMET TO HELP SECURE EXPRESS APPS WITH VARIOUS HTTP HEADERS
    .use(helmet())
    // USE MORGAN TO LOG REQUESTS TO THE CONSOLE
    .use(morgan('dev'))
    // USE HPP TO PROTECT AGAINST HTTP PARAMETER POLLUTION ATTACKS
    .use(hpp())
    // ENABLE GZIP COMPRESSION
    .use(compress())
    // CORS DOMAINE ORIGIN
    .use(cors({optionsSuccessStatus: 200}))
    // PARSE COOKIES
    .use(cookieParser());


  // ROUTES
  const apiRouter = express.Router();
  app.use( '/api/v1', apiRouter );

  // ROOT ROUTES
  apiRouter.use( '/', rootRouter );

  // AUTH ROUTES
  apiRouter.use( '/auth', authRouter );

  // FORMATION ROUTES
  apiRouter.use( '/formation', formationRouter );

  // HTTP REQUEST ERRORS
  app.use(errorMiddleware)
     .use(notFoundMiddleware);

  // RUN EXPRESS SERVER
  const server = app.listen(PORT, HOST);

  // EXPRESS SERVER ERRORS
  const closeServer = () => {
    console.log( 'close express server' );
    server.close();
    return database.disconnect().then( () => {} ).catch( () => {} );
  };

  server.on( 'error', ( err: any ) => {
    switch ( err.code ) {
      case 'EACCES':
          console.error( `${HOST}:${PORT} requires elevated privileges` );
          break;
      case 'EADDRINUSE':
          console.error( `${HOST}:${PORT} is already in use` );
          break;
      default:
          console.error( 'Error connecting ' + err );
          break;
    }
    closeServer()
      .then(_ => process.exit( 1 ) )
      .catch(_ => process.exit( 1 ) );
  });
  server.on( 'listening', () => {
    console.log( `Server listening on ${HOST}:${PORT}` );
  });

  // PROCESS EVENTS
  // gracefully stop the server in case of SIGINT (Ctrl + C) or SIGTERM (Process stopped)
  process.on( 'SIGTERM', closeServer );
  process.on( 'SIGINT', closeServer );

})
.catch( err => {
  console.error( 'Database connection error' );
  console.error( err );
  process.exit( 1 );
});
