import Database from '../database/connection.js';
class SGBD {

	/* # CREATE */
	async createItem ( table, row ) {
		const database = await Database.connect();
		var dataTable = {};
		dataTable.values = [];
		switch ( table ) {
			case 'users':
				dataTable.camps = 'nickname, name, email, password, birth, description, gender, administrator, status';
				break;
			case 'news':
				dataTable.camps = 'id_user, title, release, image, description, link, verified';
				break;
			case 'audits':
				dataTable.camps = 'id_news, id_author, id_checker, timestamp';
				break;
			case 'ratings':
				dataTable.camps = 'id_news, id_user, rating';
				break;
			case 'favorites':
				dataTable.camps = 'id_user, id_news';
				break;
			case 'comments':
				dataTable.camps = 'id_news, id_user, content, timestamp';
				break;
			default:
				return 0;
				break;
		}
		dataTable.reservad = '';
		for ( const key in row ) {
			if ( Object.hasOwnProperty.call( row, key ) ) {
				dataTable.reservad += ', ?';
				dataTable.values.push( row[ key ] );
			}
		}
		var query = `INSERT INTO ${ table } (${ dataTable.camps }) VALUES (${ dataTable.reservad.slice( 2 ) })`;
		const result = await database.run( query, dataTable.values );
		return this.readItem( table, "id", result.lastID );
	}

	/* # READ */
	async readItem(table, ...conditions) {
		const database = await Database.connect();
		let query = `SELECT * FROM ${table} WHERE `;
		const placeholders = [];
		for (let i = 0; i < conditions.length; i += 2) {
			const column = conditions[i];
			const value = conditions[i + 1];
			query += `${column} = ? AND `;
			placeholders.push(value);
		} 
		query = query.slice(0, -5);
		const result = await database.get(query, placeholders);
		return result;
	}

	async readItems(table, ...conditions) {
		const database = await Database.connect();
		let query = `SELECT * FROM ${table} WHERE `;
		const placeholders = [];
		for (let i = 0; i < conditions.length; i += 2) {
			const column = conditions[i];
			const value = conditions[i + 1];
			query += `${column} = ? AND `;
			placeholders.push(value);
		}
		query = query.slice(0, -5);
		const result = await database.all(query, placeholders);
		return result;
	}

	async readSearch ( table, column, snippet ) {
		const database = await Database.connect();
		var snippet = `%${ snippet }%`;
		const query = `SELECT * FROM ${ table } where ${ column } LIKE ?`;
		const result = await database.all( query, [ snippet ] );
		return result;
	}

	/* # UPDATE */
	async updateItem ( table, column, row, id, newValue ) {
		const database = await Database.connect();
		const query = `UPDATE ${ table } SET ${ column } = ? WHERE ${ row } = ? `;
		await database.run( query, [newValue, id ] );
		return this.readItem( table, row, id );
	}
 
	/* # DELETE */
	async deleteItem ( table, ...conditions ) {
		const database = await Database.connect();
		let query = `DELETE FROM ${table} WHERE `;
		const placeholders = [];
		for (let i = 0; i < conditions.length; i += 2) {
			const column = conditions[i];
			const value = conditions[i + 1];
			query += `${column} = ? AND `;
			placeholders.push(value);
		} 
		query = query.slice(0, -5);
		const result = await database.run(query, placeholders);
		return this.readItem( table, "id", result.lastID );
	}

	async deleteItems ( table, column, value ) {
		const database = await Database.connect();
		let query = `DELETE * FROM ${table} WHERE `;
		const placeholders = [];
		for (let i = 0; i < conditions.length; i += 2) {
			const column = conditions[i];
			const value = conditions[i + 1];
			query += `${column} = ? AND `;
			placeholders.push(value);
		} 
		query = query.slice(0, -5);
		const result = await database.run(query, placeholders);
		return this.readItem( table, "id", result.lastID );
	}

	async deleteAllLess ( table, column, value ) {
		const database = await Database.connect();
		const query = `DELETE FROM ${ table } WHERE ${ column } <> ?`;
		const result = await database.run( query, [ value ] );
		return this.readItem( table, "id", result.lastID );
	}

	async deleteAll ( table ) {
		const database = await Database.connect();
		const query = `DELETE FROM ${ table }`;
		const result = await database.run( query );
		return this.readItem( table, "id", result.lastID );
	}
}
const Model = new SGBD();

export default Model; 