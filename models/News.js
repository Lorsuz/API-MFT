import Database from '../database/connection.js';

async function createItem(cardNews) {
  const database = await Database.connect();
  const { id_user, title, description, release, image, link, verified } = cardNews;
  var query = `INSERT INTO news (id_user,	title, description,	release,	image, link, verified) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  const {lastID} = await database.run(query, [id_user, title, description, release, image, link, verified]);
  return readItem(lastID);
}

async function readItem(id) {
  const database = await Database.connect();
  const query = `SELECT * FROM news WHERE id = ?`;
  const result = await database.get(query, [id]);
  return result;
}

async function readAll() {
  const database = await Database.connect();
  const query = `SELECT * FROM news`;
  const news = await database.all(query);
  return news;
}

async function readSearch(column,snippet) {
  const database = await Database.connect();
  var tratSnippet = `%${snippet}%`
  const query = `SELECT * FROM news where ${column} LIKE ?`;
  const news = await database.all(query,[tratSnippet]);
  return news;
}

export default { 
  createItem,
  readItem,
  readAll,
  readSearch
 };
