import { nextDay } from 'date-fns';
import commonImports from './exports/router.js';
import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt';

var prisma = new PrismaClient();

var router = commonImports.router;
var Model = commonImports.Model;
var parseISO = commonImports.parseISO;
var fs = commonImports.fs;
var format = commonImports.format;
var crypto = commonImports.crypto;
var HTTPError = commonImports.HTTPError;

router.get( '/users', async ( req, res ) => {
	var users = await Model.readItems( 'users' );
	var user = req.session.user;
	if ( user == undefined ) {
		return res.redirect( '/users/login' );
	}
	res.render( 'list-users', { user, users } );
} );

router.get( '/users/prisma', async ( req, res ) => {
	try {
		var users = await prisma.user.findMany();
		res.json( users );
	} catch ( error ) {
		console.error( error );
		res.status( 500 ).json( { error: 'Internal server error' } );
	}
} );

router.get( '/users/read/:id', async ( req, res ) => {
	var id = req.params.id;
	var result = await Model.readItem( 'users', 'id', id );
	res.json( result );
} );

router.get( '/users/dashboard/:nickname', async ( req, res ) => {

	var nickname = req.params.nickname.charAt( 0 ).toUpperCase() + req.params.nickname.slice( 1 ).toLowerCase();
	if ( nickname == undefined ) {
		return res.redirect( '/' );
	}
	var userProfile = await Model.readItem( 'users', 'nickname', nickname );
	var user = req.session.user;
	if ( userProfile == undefined ) {
		return res.redirect( '/' );
	} else {
		var news = await Model.readItems( 'news', 'id_user', userProfile.id );
		userProfile.birth = format( parseISO( userProfile.birth ), 'dd/MM/yyyy' );

		await Promise.all( news.map( async ( card ) => {
			card.release = format( parseISO( card.release + 'T00:00:00' ), 'dd/MM/yyyy' );

			var id_news = card.id;
			var ratings = [];
			for ( let index = 1; index <= 5; index++ ) {
				var promise = await Model.readItems( 'ratings', 'id_news', id_news, 'rating', index );
				var count = Object.keys( promise ).length !== undefined ? Object.keys( promise ).length : 0;
				ratings.push( { 'star': index, 'count': count } );
			}
			let total_rating = 0;
			let ratting_based_on_star = 0;

			ratings.forEach( ( rating ) => {
				total_rating += rating.count;
				ratting_based_on_star += rating.count * rating.star;
			} );

			card[ 'average' ] = isNaN( ( ratting_based_on_star / total_rating ) ) ? 0 : ( ratting_based_on_star / total_rating ).toFixed( 1 );
			card[ 'rating' ] = `${ isNaN( card[ 'average' ] / 5 ) ? 0 : ( card[ 'average' ] / 5 ) * 100 }%`;
		} ) );

		if ( userProfile.description == '' ) {
			userProfile.description = 'Conta sem descrição...';
		}


		res.render( './dashboard', { user, userProfile, news } );
	}
} );

router.get( '/users/register', async ( req, res ) => {
	var user = req.session.user;
	if ( user != undefined ) {
		return res.redirect( `/users/dashboard/${ user.nickname }` );
	}

	var backup = {
		nickname: 'Administradore',
		name: 'Administradore supreme',
		email: 'administradore@gmail.com',
		password: '#A1r2i3e4l5',
		confirmPassword: '#A1r2i3e4l5',
		birth: '2006-04-17',
		description: 'Sou eu que mando aqui'
	};

	res.render( './sign-account', { user, errorAction: '', backup: backup } );
} );


router.get( '/users/read', async ( req, res ) => {
	var user = req.session.user;
	var users = await Model.readItems( 'users' );
	res.render( './list-users', { user, users } );
} );


router.get( '/users/login', ( req, res ) => {
	var user = req.session.user;
	if ( req.session.user != undefined ) {
		return res.redirect( `/users/dashboard/${ req.session.user.nickname }` );
	}
	var backup = {
		email: 'administrador@gmail.com',
		password: '12345678'
	};
	res.render( './login-account', { user, errorAction: '', backup: '' } );
} );

router.get( '/users/update', async ( req, res ) => {
	req.session.user = await Model.readItem( 'users', 'id', 1 );
	var user = req.session.user;
	if ( user == undefined ) {
		return res.redirect( '/users/login' );
	}
	res.render( './update-account', { user, backup: user, errorAction: '' } );
} );

router.get( '/users/logout', ( req, res ) => {
	var user = req.session.user;
	if ( user == undefined ) {
		return res.redirect( '/' );
	}
	req.session.destroy( ( err ) => {
		if ( err ) {
		} else {
			return res.redirect( '/' );
		}
	} );
} );

router.get( '/users/accept/:id', async ( req, res, next ) => {
	var id = req.params.id;
	var user = req.session.user;
	if ( user == undefined ) {
		return res.redirect( '/users/read' );
	} else if ( id == undefined ) {
		return res.redirect( `/users/read` );
	}
	if ( !user.administrator ) {
		return res.redirect( '/users/read' );
	}
	if ( id == 1 ) {
		return res.redirect( '/users/read' );
	}
	var userDelete = await Model.readItem( 'users', 'id', id );
	if ( userDelete == undefined ) {
		return res.redirect( '/users/read' );
	}
	await Model.updateItem( 'users', 'status', 'id', id, 0 );

	return res.redirect( '/users/read' );
} );

router.get( '/users/delete/:id', async ( req, res, next ) => {
	var id = req.params.id;
	var user = req.session.user;
	if ( user == undefined ) {
		return res.redirect( '/users/read' );
	} else if ( id == undefined ) {
		return res.redirect( `/users/read` );
	}
	if ( !user.administrator ) {
		return res.redirect( '/users/read' );
	}
	if ( id == 1 ) {
		return res.redirect( '/users/read' );
	}
	var userDelete = await Model.readItem( 'users', 'id', id );
	if ( userDelete == undefined ) {
		return res.redirect( '/users/read' );
	}
	Model.deleteItem( 'users', 'id', id );
	return res.redirect( '/users/read' );
} );

/* ==================================================================== */

router.post( '/users/register', async ( req, res ) => {
	var { nickname, name, email, password, confirmPassword, birth, description, gender, administrator } = req.body;
	var user = req.session.user;

	if ( user ) {
		return res.redirect( '/' );
	}

	var capitalize = ( param ) => {
		return param.trim().split( ' ' ).map( word => word.charAt( 0 ).toUpperCase() + word.slice( 1 ) ).join( ' ' );
	};

	var validateEmail = ( email ) => {
		var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test( email );
	};

	var validateNickname = ( nickname ) => {
		return nickname.trim().split( ' ' ).length === 1;
	};

	var errorAction = { nickname: '', email: '', confirmPassword: '' };

	if ( !validateEmail( email ) ) {
		errorAction.email = 'E-mail inválido';
	} else {
		var existingUserByEmail = await Model.readItem( 'users', 'email', email );
		if ( existingUserByEmail ) {
			errorAction.email = 'Esse e-mail já está cadastrado';
			if ( !existingUserByEmail.status ) {
				errorAction.email = 'E-mail em processo de aprovação';
			}
		}
	}

	if ( !validateNickname( nickname ) ) {
		errorAction.nickname = 'O nickname deve conter apenas 1 palavra';
	} else {
		var existingUserByNickname = await Model.readItem( 'users', 'nickname', nickname );
		if ( existingUserByNickname ) {
			errorAction.nickname = 'Esse nickname já está em uso';
		}
	}
	async function hashPassword ( password ) {
		try {
			const hash = await bcrypt.hash( password, 10 );
			return hash;
		} catch ( err ) {
			console.error( 'Erro ao criptografar a senha:', err );
			throw err; // Você pode lidar com o erro ou lançá-lo novamente para tratamento posterior
		}
	}
	const passwordHashed = await hashPassword( password );
	console.log( `passwordHashed: ${ passwordHashed }` );

	gender = gender == 1 ? 'Masculino' : 'Feminino';


	var errorActionActive = Object.values( errorAction ).some( error => error !== '' );

	if ( errorActionActive ) {
		var backup = { nickname, name, email, password, confirmPassword, birth, gender, description };
		return res.render( './sign-account', { user, errorAction, backup } );
	}

	var status = 1;
	if ( administrator == 1 ) {
		status = 0;
	}
	var newUser = { nickname, name, email, passwordHashed, birth, description, gender, administrator, status };

	Model.createItem( 'users', newUser )
		.then( async createdUser => {
			try {
				await prisma.user.deleteMany();
				var newUserPrisma = await prisma.user.create( {
					data: {
						name,
						email
					}
				} );
				req.session.user = createdUser;
				return res.redirect( '/' );
			} catch ( error ) {
				req.session.user = createdUser;
				return res.render( './confirm-email', { user: createdUser } );
			}
		} )
		.catch( err => {
			console.error( 'Erro ao salvar o usuário:', err );
		} );
} );


router.post( '/users/login', async ( req, res ) => {
	var { email, password } = req.body;
	var errorActionActive = false;
	var user = req.session.user;
	var errorAction = { email, password };
	var result = await Model.readItem( 'users', 'email', email );
	for ( let key in errorAction ) {
		if ( errorAction.hasOwnProperty( key ) ) {
			errorAction[ key ] = '';
		}
	}
	if ( result == undefined ) {
		errorAction.email = 'Não existe nenhum cadastro com esse email...';
	}

	async function comparePasswords ( userPassword, hashedPassword ) {
		try {
			const result = await bcrypt.compare( userPassword, hashedPassword );
			return result;
		} catch ( err ) {
			console.error( 'Erro ao comparar as senhas:', err );
			throw err; // Você pode lidar com o erro ou lançá-lo novamente para tratamento posterior
		}
	}
	var passwordsMatch = await comparePasswords( password, result.password );

	if ( result != undefined && !passwordsMatch ) {
		errorAction.password = 'A senha está incorreta';
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
		return res.render( './login-account', { user, errorAction, backup } );
	} else {
		req.session.user = result;
		return res.redirect( '/' );
	}
} );

router.post( '/users/update', async ( req, res ) => {
	var user = req.session.user;
	if ( user == undefined ) {
		return res.redirect( '/users/login' );
	}

	// var background = req.file ? await newName(req.file, 'backgrounds') : user.background;
	// var profile = req.file ? await newName(req.file, 'profiles') : user.profile;

	async function newName ( file, type ) {
		var fileExtension = file.originalname.split( '.' ).pop();
		var fileName = Date.now() + '.' + fileExtension;
		var newFilePath = `../public/images/uploads/${ type }/` + fileName;
		await fs.rename( file.path, newFilePath );
		return newFilePath;
	}

	var { nickname, name, email, password, confirmPassword, birth, description, gender } = req.body;
	var errorActionActive = false;
	var errorAction = { nickname, email, confirmPassword };
	gender = gender == 1 ? 'Masculino' : 'Feminino';

	function parseToCapitalize ( params ) {
		var newParams = [];
		params = params.trim().split( ' ' );
		for ( var i = 0; i < params.length; i++ ) {
			var element = params[ i ];
			element = element.trim();
			if ( element != '' ) {
				newParams.push( element.charAt( 0 ).toUpperCase() + element.slice( 1 ).toLowerCase() );
			}
		}
		return newParams.join( ' ' );
	}

	nickname = parseToCapitalize( nickname );
	name = parseToCapitalize( name );
	email = email.toLowerCase();

	for ( let key in errorAction ) {
		if ( errorAction.hasOwnProperty( key ) ) {
			errorAction[ key ] = '';
		}
	}

	var promise = await Model.readItem( 'users', 'email', email );
	if ( promise != undefined && promise.id != user.id ) {
		errorAction.email = 'Esse E-mail já está cadastrado...';
	}

	var promise = await Model.readItem( 'users', 'nickname', nickname );
	if ( promise != undefined && promise.id != user.id ) {
		errorAction.nickname = 'Esse nickname já está em uso...';
	}

	if ( nickname.split( ' ' ).length > 1 ) {
		errorAction.nickname = 'O nickname deve conter apenas 1 palavra...';
	}

	if ( password.length < 8 ) {
		errorAction.password = 'A senha deve conter pelo menos 8 dígitos...';
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
		var backup = { nickname, name, email, password, birth, gender, description };
		res.render( './update-account', { user, errorAction, backup } );
	} else {
		await Model.updateItem( 'users', 'nickname', 'id', user.id, nickname );
		await Model.updateItem( 'users', 'name', 'id', user.id, name );
		await Model.updateItem( 'users', 'email', 'id', user.id, email );
		await Model.updateItem( 'users', 'password', 'id', user.id, password );
		await Model.updateItem( 'users', 'birth', 'id', user.id, birth );
		await Model.updateItem( 'users', 'gender', 'id', user.id, gender );
		await Model.updateItem( 'users', 'description', 'id', user.id, description );
		return res.redirect( `/users/dashboard/${ user.nickname }` );
	}
} );


export default router;
