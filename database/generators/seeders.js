import { resolve } from 'node:path';
import { readFileSync } from 'node:fs';
import Model from '../../models/Model.js';

async function up () {
	const file = resolve( 'database', 'generators', 'jsons', 'data.json' );

	const data = JSON.parse( readFileSync( file ) );

	for ( const user of data.users ) {
		await Model.createItem('users', user );
	}

	for (const cardNews of data.news) {
	  await Model.createItem('news', cardNews);
	}

}

export default { up };
