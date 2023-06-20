import Database from '../database/connection.js';


async function createItem ( user ) {
	const database = await Database.connect();
	const { nickname, email, password, birth, description, administrator } = user;
	var query = 'INSERT INTO users (nickname, email, password, birth, description, administrator) VALUES (?, ?, ?, ?, ?, ?)';
	const { lastID } = await database.run( query, [ nickname, email, password, birth, description, administrator ] );
	return readItemForId( lastID );
}

async function readAll () {
	const database = await Database.connect();
	const query = `SELECT * FROM users`;
	const result = await database.get( query );
	return result;
}

async function readItemForId ( id ) {
	const database = await Database.connect();
	const query = `SELECT * FROM users WHERE id = ?`;
	const result = await database.get( query, [ id ] );
	return result;
}

async function readItemForColumn ( column, value ) {
	const database = await Database.connect();
	const query = `SELECT * FROM users WHERE ${ column } = ?`;
	const result = await database.get( query, [ value ] );
	return result;
}

async function deleteAll () {
	const database = await Database.connect();
	const query = `DELETE * FROM users`;
	const result = await database.get( query, [ value ] );
	return result;
}

async function deleteItem ( id ) {
	const database = await Database.connect();
	const query = `DELETE FROM users WHERE id = ?`;
	const result = await database.get( query, [ id ] );
	return result;
}

async function deleteItemForColumn ( column, value ) {
	const database = await Database.connect();
	const query = `DELETE FROM users WHERE ${ column } <> ?`;
	const result = await database.get( query, [ value ] );
	return result;
}

async function deleteLess ( column, value ) {
	const database = await Database.connect();
	const query = `DELETE FROM users WHERE ${ column } <> ?`;
	const result = await database.get( query, [ value ] );
	return result;
}

export default {
	createItem,
	readAll,
	readItemForId,
	readItemForColumn,
	deleteLess
};
