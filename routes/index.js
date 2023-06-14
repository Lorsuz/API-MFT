import commonImports from './exports/router.js';

var router = commonImports.router;
var Users = commonImports.Users
var News = commonImports.News;
var parseISO = commonImports.parseISO;
var format = commonImports.format;
var HTTPError = commonImports.HTTPError;

router.get( '/', async ( req, res, next ) => {

	if ( !req.session.loggedIn || req.session.loggedIn == undefined || req.session.loggedIn == null ) {
		req.session.loggedIn = false;
	} else {
		req.session.loggedIn = true;
	}

	var loggedIn = req.session.loggedIn;

	var search = req.query.search;
	var results = await News.readAll();
	var msg = 'notícias encontradas';

	if ( search != undefined && search != '' ) {
		console.log( search );
		results = await News.readSearch( 'title', search );
	} else {
		search = '';
	}

	if ( results ) {
		results.forEach( card => {
			console.log(card.release);
			card.release = format( parseISO( card.release ), 'dd/MM/yyyy' );
			console.log(card.release);
		} );
		if ( results.length == 1 ) {
			msg = 'notícia encontrada';
		}
	} else {
		throw new HTTPError( 'Invalid data to create investment', 400 );
	}

	res.render( './index', { loggedIn: loggedIn, totalCards: results.length, plural: msg, cards: results, search: search } );
} );

export default router;
