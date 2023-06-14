import Database from '../database/connection.js';

async function createItem(user) {
  const database = await Database.connect();
  const { nickname, email, password, birth, description, administrator } = user;
  var query = 'INSERT INTO users (nickname, email, password, birth, description, administrator) VALUES (?, ?, ?, ?, ?, ?)';
  const {lastID} = await database.run(query, [nickname, email, password, birth, description, administrator]);
  return readItemForId(lastID);
}

async function readItemForId(id) {
  const database = await Database.connect();
  const query = `SELECT * FROM users WHERE id = ?`;
  const user = await database.get(query, [id]);
  return user;
}

async function readItemForColumn(column,value) {
  const database = await Database.connect();
  const query = `SELECT * FROM users WHERE ${column} = ?`;
  const user = await database.get(query, [value]);
  return user;
}


export default { 
  createItem,
  readItemForId,
  readItemForColumn
 };
