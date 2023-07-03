import commonImports from './exports/router.js';

var router = commonImports.router;
var Model = commonImports.Model;
var parseISO = commonImports.parseISO;
var format = commonImports.format;
var HTTPError = commonImports.HTTPError;

router.get( '/favorites/:id_news', async ( req, res ) => {
	console.log('entrou aqui');
	var id = req.params.id_news;
	var user = req.session.user;
	var result;
	if ( id == undefined || user == undefined ) {
		return res.json( { value: false } );
	}
	var favorite = await Model.readItem( 'favorites', 'id', id, 'id_user', user.id );
	if ( favorite == undefined ) {
		var row = { id_user: user.id, id_news: id };
		console.log(row);
		await Model.createItem( 'favorites', row );
		result = { value: true };
	} else {
		await Model.deleteItem( 'favorites', 'id', id, 'id_user', user.id );
		result = { value: false };
	}
	console.log(result);
	return res.json( result );
} );

export default router;
