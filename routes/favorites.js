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

router.get( '/favorites', ( req, res ) => {
	
} );

export default router;
