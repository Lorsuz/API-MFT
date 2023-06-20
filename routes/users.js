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

router.get( '/users/register', async ( req, res ) => {
	// await Users.deleteLess("id",1);

	var backup = { 
		nickname: 'Administrador',
		email: 'administrador@gmail.com', 
		password: '12345678', 
		confirmPassword: '12345678',
		birth: '2006-04-17', 
		description: 'Sou eu que mando aqui'
	};

	res.render( './sign-acount', { errorAction: "", backup } );
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
	const { nickname, email, password, confirmPassword, birth, description, administrator } = req.body;
	var promisse 
	var errorActionActive = false
	var errorAction = {nickname, email, confirmPassword};

	for (let key in errorAction) {
		if (errorAction.hasOwnProperty(key)) {
			errorAction[key] = '';
		}
	}

	promisse = await Users.readItemForColumn( "email", email );
	if ( promisse != undefined ) {
		errorAction.email = "Esse E-mail já esta cadastrado...";
	}

	var promisse = await Users.readItemForColumn( "nickname", nickname );
	if ( promisse != undefined ) {
		errorAction.nickname = "Esse nickname já esta em uso...";
	}
	
	if(password !=confirmPassword){
		errorAction.confirmPassword = "Sua confirmação de senha está errada...";
	}

	for (let key in errorAction) {
		if (errorAction.hasOwnProperty(key)) {
			console.log(errorAction[key]);
			if(errorAction[key] != ''){
				errorActionActive = true
			}
		}
	}

	if ( errorActionActive ) {
		var backup = { nickname, email, password, confirmPassword, birth, description };
		res.render( './sign-acount', { errorAction, backup } );
	} else {
		var newUser = { nickname, email, password, birth, description, administrator };
		var result = await Users.createItem( newUser );
		req.session.loggedIn = true;
		req.session.user = result;
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
