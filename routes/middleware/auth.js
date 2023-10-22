import jwt from 'jsonwebtoken';
import { promisify } from 'util';

async function isAuthenticated ( req, res, next ) {
	try {
		const token = req.cookies.jwt;
		console.log( 'token', token);
		console.log('env ',process.env.JWT_SECRET);
		const verifyAsync = promisify( jwt.verify );
		const decoded = await verifyAsync( token, process.env.JWT_SECRET );
		req.user = decoded;
		return next();
	} catch ( error ) {
		return res.status( 401 ).json( { auth: false, message: error.message } );
	}
}

export default isAuthenticated;
