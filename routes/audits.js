import commonImports from './exports/router.js';

var router = commonImports.router;
var Model = commonImports.Model;
var parseISO = commonImports.parseISO;
var format = commonImports.format;
var HTTPError = commonImports.HTTPError;

router.get( '/audits', ( req, res ) => {
	var user = req.session.user
	if(user ==undefined){
		return res.redirect('/')
	}
	if(!user.administrator){
		return res.redirect('/')
	}
	res.render('./audits',{user, audits})
} );

export default router;
