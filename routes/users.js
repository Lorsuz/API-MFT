import commonImports from './exports/router.js';

var router = commonImports.router;
var Model = commonImports.Model;
var parseISO = commonImports.parseISO;
var format = commonImports.format;
var HTTPError = commonImports.HTTPError;

router.get( '/users', async ( req, res ) => {
	var result = await Model.readItems('users');
	res.json( result );
} );

router.get( '/users/dashboard/:id', async ( req, res ) => {
	var id = req.params.id;
	var user = await Model.readItem('users', 'id', id );
	if ( user == undefined ) {
		res.redirect( '/' );
	}
	var news = await Model.readItems('news', 'id_user', user.id );
	user.administrator = user.administrator ? 'Administrador' : 'Usuário';
	user.birth = format( parseISO( user.birth ), 'dd/MM/yyyy' );

	res.render( './dashboard', { user, news } );
} );

router.get( '/users/register', async ( req, res ) => {
	// await Model.deleteAllLess('users','id',1);

	var backup = {
		nickname: 'Administrador',
		name: 'Administrador supremo',
		email: 'administrador@gmail.com',
		password: '12345678',
		confirmPassword: '12345678',
		birth: '2006-04-17',
		description: 'Sou eu que mando aqui'
	};

	res.render( './sign-acount', { errorAction: '', backup } );
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
		} else {
			res.redirect( '/' );
		}
	} );
} );

/* ==================================================================== */

router.post( '/users/register', async ( req, res ) => {
	var { nickname, name, email, password, confirmPassword, birth, description, gender, administrator } = req.body;
	var promise;
	var errorActionActive = false;
	var errorAction = { nickname, email, confirmPassword };
	gender = gender == 1 ? 'Masculino' : 'Feminino';
	function parseToCapitalize ( params ) {
		params = params.split( ' ' );
		for ( var i = 0; i < params.length; i++ ) {
			var word = params[ i ];
			word = word.trim();
			params[ i ] = word.charAt( 0 ).toUpperCase() + word.slice( 1 );
		}
		return params.join( ' ' );
	}
	nickname = await parseToCapitalize( nickname );
	name = await parseToCapitalize( name );

	for ( let key in errorAction ) {
		if ( errorAction.hasOwnProperty( key ) ) {
			errorAction[ key ] = '';
		}
	}
	promise = await Model.readItem( 'users', 'email', email );
	if ( promise != undefined ) {
		errorAction.email = 'Esse E-mail já esta cadastrado...';
	}
	var promise = await Model.readItem( 'users', 'nickname', nickname );
	if ( promise != undefined ) {
		errorAction.nickname = 'Esse nickname já esta em uso...';
	}
	if ( password.length < 8 ) {
		errorAction.password = 'A senha deve conter pelo menos 8 digitos...';
	}
	if ( password != confirmPassword ) {
		errorAction.confirmPassword = 'Sua confirmação de senha está errada...';
	}
	for ( let key in errorAction ) {
		if ( errorAction.hasOwnProperty( key ) ) {
			if ( errorAction[ key ] != '' ) {
				errorAction[ key ] = `<i class='fa-solid fa-triangle-exclamation'></i> ${ errorAction[ key ] }`;
				errorActionActive = true;
			}
		}
	}
	if ( errorActionActive ) {
		var backup = { nickname, name, email, password, confirmPassword, birth, gender, description };
		res.render( './sign-acount', { errorAction, backup } );
	} else {
		var newUser = { nickname, name, email, password, birth, description, gender, administrator };
		newUser = await Model.createItem( 'users', newUser );
		req.session.user = newUser;
		res.redirect( '/' );
	}
} );

router.post( '/users/login', async ( req, res ) => {
	const { email, password } = req.body;
	var errorActionActive = false;
	var errorAction = { email, password };
	var promise = await Model.readItem( 'users', 'email', email );
	for ( let key in errorAction ) {
		if ( errorAction.hasOwnProperty( key ) ) {
			errorAction[ key ] = '';
		}
	}
	if ( promise == undefined ) {
		errorAction.email = 'Não existe nenhum cadastro com esse email...';
	}
	if ( promise != undefined && promise.password != password ) {
		errorAction.password = 'A senha está incorreta...';
	}
	for ( let key in errorAction ) {
		if ( errorAction.hasOwnProperty( key ) ) {
			if ( errorAction[ key ] != '' ) {
				errorAction[ key ] = `<i class='fa-solid fa-triangle-exclamation'></i> ${ errorAction[ key ] }`;

				errorActionActive = true;
			}
		}
	}
	if ( errorActionActive ) {
		var backup = { email, password };
		res.render( './login-acount', { errorAction, backup } );
	} else {
		req.session.user = promise;
		res.redirect( '/' );
	}
} );

export default router;
