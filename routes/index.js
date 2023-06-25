import commonImports from './exports/router.js';

var router = commonImports.router;
var Model = commonImports.Model;
var parseISO = commonImports.parseISO;
var format = commonImports.format;
var HTTPError = commonImports.HTTPError;

router.get( '/', async ( req, res, next ) => {
	if ( req.session.user == undefined ) {
		// req.session.user = 0;
		req.session.user = await Model.readItem( 'users', 'id', 1 );
	}
	// await Model.deleteAll('ratings')
	var user = req.session.user;
	var search = req.query.search;
	var results = await Model.readItems( 'news' );
	var msg = 'notícias encontradas';
	if ( search != undefined && search != '' ) {
		results = await Model.readSearch( 'news', 'title', search );
	} else {
		search = '';
	}
	if (results) {
		await Promise.all(results.map(async (card) => {
			card.release = format(parseISO(card.release + 'T00:00:00'), 'dd/MM/yyyy');
	
			var id_news = card.id;
			var ratings = [];
			for (let index = 1; index <= 5; index++) {
				var promisse = await Model.readItems('ratings', 'id_news', id_news, 'rating', index);
				var count = Object.keys(promisse).length !== undefined ? Object.keys(promisse).length : 0;
				ratings.push({ 'star': index, 'count': count });
			}
			let total_rating = 0;
			let ratting_based_on_star = 0;
	
			ratings.forEach((rating) => {
				total_rating += rating.count;
				ratting_based_on_star += rating.count * rating.star;
			});
	
			let rating__average = (ratting_based_on_star / total_rating).toFixed(1);
			card['rating'] = `${isNaN(rating__average / 5) ? 0 : (rating__average / 5) * 100}%`;
		}));
	
		if (results.length == 1) {
			msg = 'notícia encontrada';
		}
	} else {
		throw new HTTPError('Invalid data', 400);
	}
	
	res.render('./index', { user: user, totalCards: results.length, plural: msg, cards: results, search: search });
} );

export default router;
