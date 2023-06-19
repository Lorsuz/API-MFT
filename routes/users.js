import commonImports from './exports/router.js';

var router = commonImports.router;
var Users = commonImports.Users;
var News = commonImports.News;
var Audits = commonImports.Audits;
var Comments = commonImports.Comments;
var Favorites = commonImports.Favorites;
var Ratings = commonImports.Ratings;
var parseISO = commonImports.parseISO;
var format = commonImports.format;
var HTTPError = commonImports.HTTPError;

router.get( '/users', async ( req, res ) => {
	var result = await Users.readAll();
	console.log( result );
	res.json( result );
} );

router.get( '/users/register', ( req, res ) => {
	res.render( './sign-acount', { errorAction: "" } );
} );

router.get( '/users/login', ( req, res ) => {
	res.render( './login-acount', { errorAction: '' } );
} );

router.get( '/users/logout', ( req, res ) => {
	req.session.destroy( ( err ) => {
		if ( err ) {
			console.log( err );
		} else {
			res.redirect( '/' );
		}
	} );
} );

/* ==================================================================== */

router.post( '/users/register', async ( req, res ) => {
	const { nickname, email, password, birth, description, administrator } = req.body;
	var errorAction = '';
	var results = await Users.readItemForColumn( "email", email );
	if ( results && results != undefined ) {
		if ( results.password != password ) {
			errorAction = "senha incorreta";
		}
	} else {
		errorAction = "Não existe nenhum cadastro com esse email";
	}
	if ( errorAction != '' ) {
		res.render( './sign-acount', { errorAction } );
	} else {
		req.session.loggedIn = true;
		req.session.user = results;
		res.redirect( '/' );
	}
} );

router.post( '/users/login', async ( req, res ) => {
	const { email, password } = req.body;
	var errorAction = '';
	var results = await Users.readItemForColumn( "email", email );
	if ( results && results != undefined ) {
		if ( results.password != password ) {
			errorAction = "senha incorreta";
		}
	} else {
		errorAction = "Não existe nenhum cadastro com esse email";
	}
	if ( errorAction != '' ) {
		res.render( './login-acount', { errorAction } );
	} else {
		req.session.user = results;
		res.redirect( '/' );
	}
} );

export default router;
