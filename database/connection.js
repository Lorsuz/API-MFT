import { resolve } from 'node:path';
import { Database } from 'sqlite-async';

const dbFilePath = resolve('database', 'database.sqlite');

async function connect() {
  return await Database.open(dbFilePath);
}

export default { connect };
