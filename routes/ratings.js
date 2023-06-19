import commonImports from './exports/router.js';

var router = commonImports.router;
var Users = commonImports.Users;
var News = commonImports.News;
var Audits = commonImports.Audits;
var Comments = commonImports.Comments;
var Favorites = commonImports.Favorites;
var Ratings = commonImports.Ratings;
var parseISO = commonImports.parseISO;
var format = commonImports.format;
var HTTPError = commonImports.HTTPError;

router.get( '/ratings', async ( req, res ) => {
	var result = await News.readAll();
	res.json( result );
} );


router.get( '/ratings/read/:id', async ( req, res ) => {
	var id = req.params.id
	var result = await News.read(id);
	res.json( result );
} );

router.post( '/ratings/create', async ( req, res ) => {
	
	var id = req.params.id
	var result = await News.read(id);
	res.json( result );
} );

export default router;
