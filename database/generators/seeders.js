import { resolve } from 'node:path';
import { readFileSync } from 'node:fs';
import Users from '../../models/Users.js';
import News from '../../models/News.js';

async function up () {
	const file = resolve( 'database', 'generators', 'jsons', 'data.json' );

	const data = JSON.parse( readFileSync( file ) );

	for ( const user of data.users ) {
		await Users.createItem( user );
	}

	for (const cardNews of data.news) {
	  await News.createItem(cardNews);
	}

}

export default { up };
