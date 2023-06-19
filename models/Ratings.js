import Database from '../database/connection.js';

async function createItem(rating) {
  const database = await Database.connect();
  const { id_news,	id_author, id_checker,	timestamp } = rating;
  var query = `INSERT INTO ratings (id_news,	id_author, id_checker,	timestamp) VALUES (?, ?, ?, ?)`;
  const {lastID} = await database.run(query, [id_news,	id_author, id_checker,	timestamp]);
  return readItem(lastID);
}

async function readAll() {
	const database = await Database.connect();
	const query = `SELECT * FROM ratings`;
	const result = await database.all(query);
	return result;
}

async function readItem(id_user) {
  const database = await Database.connect();
  const query = `SELECT * FROM ratings WHERE id_user = ?`;
  const result = await database.get(query, [id_user]);
  return result;
}


export default { 
  createItem,
  readItem,
  readAll
 };
