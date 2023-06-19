import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import livereload from 'livereload';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

var app = express();

import newsRouter from './routes/news.js';
import indexRouter from './routes/index.js';
import usersRouter from './routes/users.js';
import auditsRouter from './routes/audits.js';
import ratingsRouter from './routes/ratings.js';
import commentsRouter from './routes/comments.js';
import favoritesRouter from './routes/favorites.js';

/* ==================================================================== */


const __filename = fileURLToPath( import.meta.url );
const __dirname = dirname( __filename );

app.set( 'views', path.join( __dirname, 'views' ) );
app.set( 'view engine', 'ejs' );

app.use( logger( 'dev' ) );
app.use( express.json() );
app.use( express.urlencoded( { extended: false } ) );
app.use( cookieParser() );
app.use( express.static( path.join( __dirname, 'public' ) ) );

const liveReloadServer = livereload.createServer({port: 35729});
liveReloadServer.watch( path.join( __dirname, 'public' ) );

app.use( '/', indexRouter );
app.use( '/news', newsRouter );
app.use( '/users', usersRouter );
app.use( '/audits', auditsRouter );
app.use( '/ratings', ratingsRouter );
app.use( '/comments', commentsRouter );
app.use( '/favorites', favoritesRouter );


app.use( function ( req, res, next ) {
	next( createError( 404 ) );
} );

app.use( function ( err, req, res, next ) {

	res.locals.message = err.message;
	res.locals.error = req.app.get( 'env' ) === 'development' ? err : {};

	res.status( err.status || 500 );
	console.log( `Error: ${ err.message }\n\n ${ err }` );
	res.send( `Error: ${ err.message }\n\n ${ err }` );
} );

export default app;