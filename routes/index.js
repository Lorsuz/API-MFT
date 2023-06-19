import commonImports from './exports/router.js';

var router = commonImports.router;
var Users = commonImports.Users
var News = commonImports.News;
var Audits = commonImports.Audits;
var Comments = commonImports.Comments;
var Favorites = commonImports.Favorites;
var Ratings = commonImports.Ratings;
var parseISO = commonImports.parseISO;
var format = commonImports.format;
var HTTPError = commonImports.HTTPError;

router.get( '/', async ( req, res, next ) => {

	if ( !req.session.user || req.session.user == undefined || req.session.user == null ) {
		req.session.user = 0;
	}

	var user = req.session.user;

	var search = req.query.search;
	var results = await News.readAll();
	var msg = 'notícias encontradas';

	if ( search != undefined && search != '' ) {
		console.log( search );
		results = await News.readSearch( 'title', search );
	} else {
		search = '';
	}
	var array = {}
	if ( results ) {
		results.forEach( card => {
			var arrayBefore = card.release
			card.release = format( parseISO( card.release ), 'dd/MM/yyyy' );
			var arrayAfter = card.release
			array[arrayBefore] = arrayAfter
		} );
		console.log(`News response:\n${array}`);
		if ( results.length == 1 ) {
			msg = 'notícia encontrada';
		}
	} else {
		throw new HTTPError( 'Invalid data to create investment', 400 );
	}

	res.render( './index', { user: user, totalCards: results.length, plural: msg, cards: results, search: search } );
} );

export default router;
