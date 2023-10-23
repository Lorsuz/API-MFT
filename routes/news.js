import commonImports from './exports/router.js';

var router = commonImports.router;
var upload = commonImports.upload;
var Model = commonImports.Model;
var parseISO = commonImports.parseISO;
var format = commonImports.format;
import SendMail from '../services/send-mail.js';
var HTTPError = commonImports.HTTPError;

router.get( '/news', async ( req, res, next ) => {
	var result = await Model.readItems( 'news' );
	res.json( result );
} );

router.get( '/news/create', async ( req, res, next ) => {
	var user = req.session.user;
	if ( user == undefined ) {
		return res.redirect( '/users/login' );
	}
	res.render( './form-news', { user: user } );
} );

router.get( '/news/read/:id', async ( req, res, next ) => {
	const id = req.params.id;
	var result = await Model.readItem( 'news', 'id', id );
	res.json( result );
} );

router.get( '/news/update/:id', async ( req, res, next ) => {
	const id = req.params.id;
	const user = req.session.user;
	if ( user == undefined ) {
		return res.redirect( '/users/login' );
	} else if ( id == undefined ) {
		return res.redirect( `/users/dashboard/${ user.nickname }` );
	}

	var news = await Model.readItem( 'news', 'id', id );
	if ( news == undefined ) {
		return res.redirect( `/users/dashboard/${ user.nickname }` );
	}
	if ( news.id_user != user.id ) {
		return res.redirect( `/users/dashboard/${ user.nickname }` );
	}

	res.render( 'update-news', { user, news } );
} );
router.get( '/news/delete/:id', async ( req, res, next ) => {
	const id = req.params.id;
	const user = req.session.user;
	if ( user == undefined ) {
		return res.redirect( '/users/login' );
	} else if ( id == undefined ) {
		return res.redirect( `/users/dashboard/${ user.nickname }` );
	}

	var news = await Model.readItem( 'news', 'id', id );
	if ( news == undefined ) {
		return res.redirect( `/users/dashboard/${ user.nickname }` );
	}
	if ( news.id_user != user.id ) {
		return res.redirect( `/users/dashboard/${ user.nickname }` );
	}
	Model.deleteItem( 'news', 'id', id );

	return res.redirect( `/users/dashboard/${ user.nickname }` );
})

router.get( '/news/accept/:id', async ( req, res, next ) => {
	const id = req.params.id;
	const user = req.session.user;
	if ( user == undefined ) {
		return res.redirect( '/users/login' );
	} else if ( id == undefined ) {
		return res.redirect( `/request` );
	}

	var news = await Model.readItem( 'news', 'id', id );
	if ( news == undefined ) {
		return res.redirect( `/requests` );
	}
	await Model.updateItem( 'news', 'verified', 'id', id, 1 );
	
	await Model.createItem(`audits`, )
	

	return res.redirect( `/request` );
})

/* ==================================================================== */

router.post( '/news/create', async ( req, res, next ) => {
	var { title, release, image, description, link } = req.body;
	var id_user = req.session.user.id;
	release = format( parseISO( release ), 'yyyy-MM-dd' );
	var verified = false;
	if ( req.session.user.administrator ) {
		verified = true;
	}
	var row = { id_user, title, release, image, description, link, verified };
	await Model.createItem( 'news', row );
	SendMail.createNews(row)

	return res.redirect( '/' );
} );

router.post( '/news/update/:id', async ( req, res, next ) => {
	var { title, release, image, description, link } = req.body;
	const id = req.params.id;
	var user = req.session.user;
	if ( user == undefined ) {
		return res.redirect( '/users/login' );
	} else if ( id == undefined ) {
		return res.redirect( `/users/dashboard/${ user.nickname }` );
	}

	var news = await Model.readItem( 'news', 'id', id );
	if ( news == undefined ) {
		return res.redirect( `/users/dashboard/${ user.nickname }` );
	}
	if ( news.id_user != user.id ) {
		return res.redirect( `/users/dashboard/${ user.nickname }` );
	}

	var result;
	result = await Model.updateItem( 'news', 'title', 'id', id, title );
	result = await Model.updateItem( 'news', 'release', 'id', id, release );
	result = await Model.updateItem( 'news', 'image', 'id', id, image );
	result = await Model.updateItem( 'news', 'description', 'id', id, description );
	result = await Model.updateItem( 'news', 'link', 'id', id, link );
	news = await Model.readItem( 'news', 'id', id );
	return res.redirect( `/users/dashboard/${ user.nickname }` );
} );
export default router;