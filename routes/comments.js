import commonImports from './exports/router.js';

var router = commonImports.router;
var Model = commonImports.Model;
var parseISO = commonImports.parseISO;
var format = commonImports.format;
var HTTPError = commonImports.HTTPError;

router.post( '/comments', async ( req, res ) => {
	var result = await Model.readItems('comments')
	res.json(result)
} );



router.post( '/comments/create/', async ( req, res ) => {
	console.log('content: '+ req.body.content);
	var row = {
		id_news: req.body.id_news,
		id_user: req.session.user.id,
		content: req.body.content.charAt( 0 ).toUpperCase() + req.body.content.slice( 1 ),
		timestamp: format(new Date(), 'yyyy-MM-dd HH:mm:ss')
	}
	if(row.id_user != undefined){
		var result = await Model.createItem('comments', row)
		res.json(result)
	}else{
		res.redirect('/users/login')
	}
})

router.get( '/comments/read/:id_news', async ( req, res ) => {
	var id_news = req.params.id_news;
	var result = await Model.readItems( `comments`, `id_news`, id_news );
	if ( result != undefined ) {
		result.forEach(element => {
			element.timestamp = format(parseISO(element.timestamp), 'dd/MM/yyyy HH:mm:ss')

			
		});
		res.json( result );
	}
} );

export default router;
