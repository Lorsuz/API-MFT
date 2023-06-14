import commonImports from './exports/router.js';

var router = commonImports.router;
var Users = commonImports.Users;
var News = commonImports.News;
var parseISO = commonImports.parseISO;
var format = commonImports.format;
var HTTPError = commonImports.HTTPError;

router.get( '/users', ( req, res ) => {
	connection.query( 'SELECT * FROM users', ( error, results ) => {
		if ( error ) {
			console.error( 'Erro ao executar consulta:', error );
			return res.status( 500 ).send( 'Erro ao recuperar usuários' );
		}

		res.json( results );
	} );
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

router.post( '/users/register', ( req, res ) => {
	const { nickname, email, password, birth, description } = req.body;
	var errorAction = '';
	// if (!nickname || !email || !password) {
	//   return res.status(400).send('Nickname, email e password são obrigatórios.');
	// }

	connection.query(
		'SELECT * FROM users WHERE email = ?',
		[ email ],
		( error, LetResults ) => {

			if ( LetResults.length == 0 ) {

				connection.query(
					'INSERT INTO users (nickname, email, password, birth, description) VALUES (?, ?, ?, ?, ?)',
					[ nickname, email, password, birth, description ],
					( error, result ) => {
						if ( error ) {
							errorAction = "ocorreu algum erro durante a execusão";
						}
						if ( errorAction != '' ) {
							res.render( './sign-acount', { errorAction } );
						} else {
							req.session.loggedIn = true;
							req.session.user = result[ 0 ];
							res.redirect( '/' );
						}
					}
				);
			} else {
				errorAction = "Esse email já está em uso";
				res.render( './sign-acount', { errorAction } );
			}
		}
	);
} );

router.post( '/users/register', async ( req, res ) => {
	const { nickname, email, password, birth, description } = req.body;
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
		req.session.loggedIn = true;
		req.session.user = results;
		res.redirect( '/' );
	}
} );

export default router;
