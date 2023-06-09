import commonImports from './exports/router.js';

var router = commonImports.router;
var Model = commonImports.Model;
var parseISO = commonImports.parseISO;
var format = commonImports.format;
var HTTPError = commonImports.HTTPError;

router.get( `/ratings`, async ( req, res ) => {
	var result = await Model.readItems( `ratings` );
	res.json( result );
} );

router.get( `/ratings/count/stars/:id_news`, async ( req, res ) => {
	var id_news = req.params.id_news;
	var result = {};
	result[ `ratings` ] = [];
	for ( let index = 1; index <= 5; index++ ) {
		var promisse = await Model.readItems( `ratings`, `id_news`, id_news, `rating`, index );
		var count = Object.keys( promisse ).length != undefined ? Object.keys( promisse ).length : 0;
		result[ `ratings` ].push( { 'star': index, 'count': count } );
	}
	res.json( result );
} );

router.get( `/ratings/read/:id_news`, async ( req, res ) => {
	if(req.session.user==undefined){
		return res.redirect('/')
	}
	var id_news = req.params.id_news;
	var id_user = req.session.user.id;
	var result = await Model.readItem( `ratings`, `id_news`, id_news, `id_user`, id_user );
	if ( result == undefined ) {
		result = { rating: 0 };
	}
	res.json( result );
} );

router.post( `/ratings/rate`, async ( req, res ) => {
	
	if(req.session.user==undefined){
		return res.redirect('/')
	}
		var allRight = true;
		var rating = {
			id_news: parseInt( req.body.id_news ),
			id_user: req.session.user.id,
			rating: parseInt( req.body.rating )
		};
		for ( const key in rating ) {
			if ( rating.hasOwnProperty.call( rating, key ) ) {
				if ( rating[ key ] == undefined || rating[ key ] == `` ) {
					allRight = false;
				}
			}
		}
		var ratingExist = await Model.readItem( `ratings`, `id_news`, rating.id_news, `id_user`, rating.id_user );
		if ( allRight ) {
			if ( ratingExist == undefined ) {
				var result = await Model.createItem( `ratings`, rating );
				res.json( result );
			} else {
				if ( ratingExist.rating != rating.rating ) {
					var result = await Model.updateItem( `ratings`, `rating`, `id`, ratingExist.id, rating.rating );
					res.json( result );
				} else {
					res.json( ratingExist );
				}
			}
		}
} );

export default router;
