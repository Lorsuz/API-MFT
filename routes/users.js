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
	var backup = {
		email: 'administrador@gmail.com',
		password: '12345678'
	};
	res.render( './login-acount', { errorAction: '', backup } );
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
	var { nickname, email, password, confirmPassword, birth, description, administrator } = req.body;
	var promise;
	var errorActionActive = false;
	var errorAction = { nickname, email, confirmPassword };
	nickname = nickname.split(' ')
	for (var i = 0; i < nickname.length; i++) {
    var word = nickname[i];
    nickname[i] = word.charAt(0).toUpperCase() + word.slice(1);
  }
	nickname = nickname.join(' ');
	for ( let key in errorAction ) {
		if ( errorAction.hasOwnProperty( key ) ) {
			errorAction[ key ] = '';
		}
	}
	promise = await Users.readItemForColumn( "email", email );
	if ( promise != undefined ) {
		errorAction.email = "Esse E-mail já esta cadastrado...";
	}
	var promise = await Users.readItemForColumn( "nickname", nickname );
	if ( promise != undefined ) {
		errorAction.nickname = "Esse nickname já esta em uso...";
	}
	if ( password != confirmPassword ) {
		errorAction.confirmPassword = "Sua confirmação de senha está errada...";
	}
	for ( let key in errorAction ) {
		if ( errorAction.hasOwnProperty( key ) ) {
			console.log( errorAction[ key ] );
			if ( errorAction[ key ] != '' ) {
				errorActionActive = true;
			}
		}
	}
	if ( errorActionActive ) {
		var backup = { nickname, email, password, confirmPassword, birth, description };
		res.render( './sign-acount', { errorAction, backup } );
	} else {
		var newUser = { nickname, email, password, birth, description, administrator };
		newUser = await Users.createItem( newUser );
		req.session.user = newUser;
		res.redirect( '/' );
	}
} );

router.post( '/users/login', async ( req, res ) => {
	const { email, password } = req.body;
	var errorActionActive = false;
	var errorAction = { email, password };
	var promise = await Users.readItemForColumn( "email", email );
	for ( let key in errorAction ) {
		if ( errorAction.hasOwnProperty( key ) ) {
			errorAction[ key ] = '';
		}
	}
	if ( promise == undefined ) {
		errorAction.email = "Não existe nenhum cadastro com esse email...";
	}
	if ( promise != undefined && promise.password != password ) {
		errorAction.password = "A senha está incorreta...";
	}
	for ( let key in errorAction ) {
		if ( errorAction.hasOwnProperty( key ) ) {
			console.log( errorAction[ key ] );
			if ( errorAction[ key ] != '' ) {
				errorActionActive = true;
			}
		}
	}
	if ( errorActionActive ) {
		var backup = { email, password};
		res.render( './login-acount', { errorAction, backup } );
	} else {
		req.session.user = promise;
		res.redirect( '/' );
	}
} );

export default router;
