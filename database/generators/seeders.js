import { resolve } from 'node:path';
import { readFileSync } from 'node:fs';
import Model from '../../models/Model.js';

async function up () {
	const file = resolve( 'database', 'generators', 'jsons', 'data.json' );

	const data = JSON.parse( readFileSync( file ) );

	var index = 0
	var tables = ['users', 'news', 'audits','ratings', 'comments', 'favorites']
	
	for (const key in data) {
		if (Object.hasOwnProperty.call(data, key)) {
			const array = data[key];
			for (const element of array) {
				if(array.length != 0){
					console.log(element);
					await Model.createItem(tables[index], element);
				}
			}
		}
		index++
	}

}

export default { up };
