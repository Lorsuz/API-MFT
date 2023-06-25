import commonImports from './exports/router.js';

var router = commonImports.router;
var Model = commonImports.Model;
var parseISO = commonImports.parseISO;
var format = commonImports.format;
var HTTPError = commonImports.HTTPError;

router.get( '/news', async ( req, res, next ) => {
	var result = await Model.readItems( 'news' );
	res.json( result );
} );

router.get( '/news/create', async ( req, res, next ) => {
	if (req.session.user == undefined ) {
		req.session.user = 0;
	}
	var user = req.session.user;
	res.render( './form-news', {user: user} );
} );

router.get( '/news/read/:id', async ( req, res, next ) => {
	const id = req.params.id;
	var result = await Model.readItem('news','id', id );
	res.json( result );
} );


/* ==================================================================== */

router.post( '/news/create', async ( req, res, next ) => {
	const { title, description, date, image, link } = req.body;
	const id_user = req.session.user.id;
	// if (!nickname || !email || !password) {
	//   return res.status(400).send('Nickname, email e password são obrigatórios.');
	// }

	connection.query(
		'INSERT INTO cardnews (id_user,	title,	description,	date,	image,	link) VALUES (?, ?, ?, ?, ?, ?)',
		[ id_user, title, description, date, image, link ],
		( error, result ) => {
			if ( error ) {
				console.error( 'Erro ao adicionar noticia:', error );
				return res.status( 500 ).send( 'Erro ao adicionar Noticia.' );
			}

			connection.query(
				'SELECT * FROM cardnews WHERE title = ? OR description = ? OR link = ?',
				[ title, description, link ],
				( error, results ) => {
					if ( error ) {

					}

					if ( results.length == 0 ) {

						res.redirect( '/' );
					} else {
						// res.render('./form-news', { error: 'Credenciais inválidas' });
						res.redirect( '/' );
					}
				}
			);
		}
	);
} );

export default router;