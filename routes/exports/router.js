import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import flash from 'connect-flash';
import path from 'path';

import multer from 'multer';

import { parseISO, format } from 'date-fns';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import Model from '../../models/Model.js';

var router = express.Router();
const __filename = fileURLToPath( import.meta.url );
const __dirname = dirname( __filename );
const pathUploadBackground = multer({
  dest: path.join(__dirname, 'public', 'images', 'uploads', 'backgrounds')
});

const pathUploadProfile = multer({
  dest: path.join(__dirname, 'public', 'images', 'uploads', 'profiles')
});

router.use( bodyParser.json() );
router.use( bodyParser.urlencoded( { extended: false } ) );

router.use( session( {
	secret: 'minhachavesecreta',
	resave: false,
	saveUninitialized: true
} ) );

router.use( flash() );
router.use( ( req, res, next ) => {
	res.locals.sucess_msg = req.flash( "sucess_msg" );
	res.locals.error_msg = req.flash( "error_msg" );
	next();
} );

class HTTPError extends Error {
	constructor ( message, code ) {
		super( message );
		this.code = code;
	}
}

export default { router, Model, pathUploadBackground, pathUploadProfile, parseISO, format, HTTPError };