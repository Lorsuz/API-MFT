import Model from '../models/Model.js';

async function verifyUnconfirmedAccounts () {
	const db = new sqlite3.Database( 'path-to-your-database.db' );
	const expirationPeriod = 30 * 60 * 1000;
	const currentTime = new Date().getTime();
	const users = await Model.readItems( 'users', 'status', 0 );
	users.forEach( async user => {
		const creationTime = new Date( row.creation_date ).getTime();
		const timeDifference = currentTime - creationTime;
		if ( timeDifference >= expirationPeriod ) {
			const deleteQuery = 'DELETE FROM users WHERE id = ?';
			await Model.deleteItem( 'users', 'id', user.id );
		}
	} );
}
export default verifyUnconfirmedAccounts
