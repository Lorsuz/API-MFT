import { response } from 'express';
import Database from '../connection.js';

async function up () {
	const database = await Database.connect();

	var query = [
		`	
			CREATE TABLE IF NOT EXISTS users (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				background VARCHAR(50) DEFAULT('default-background.jpg'),
				profile VARCHAR(50) DEFAULT('default-profile.jpg'),
				nickname VARCHAR(100) NOT NULL,
				name VARCHAR(100) NOT NULL,
				email VARCHAR(100) NOT NULL,
				password VARCHAR(100) NOT NULL,
				birth DATE NOT NULL,
				gender VARCHAR(10) NOT NULL,
				description TEXT NOT NULL,
				administrator BOOLEAN DEFAULT(0) NOT NULL
			);		
		`,
		`
			CREATE TABLE IF NOT EXISTS news (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				id_user INTEGER NOT NULL,
				title VARCHAR(200) NOT NULL,
				description TEXT NOT NULL,
				release DATE NOT NULL,
				likes INTEGER DEFAULT(0) NOT NULL,
				image VARCHAR(100) NOT NULL,
				link VARCHAR(100) NOT NULL,
				verified BOOLEAN DEFAULT(0) NOT NULL,
				FOREIGN KEY (id_user) REFERENCES users(id)
			);
		`,
		`
			CREATE TABLE IF NOT EXISTS audits (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				id_news INTEGER NOT NULL,
				id_author INTEGER NOT NULL,
				id_checker INTEGER NOT NULL,
				timestamp TIMESTAMP NOT NULL,
				FOREIGN KEY (id_news) REFERENCES news(id),
				FOREIGN KEY (id_author) REFERENCES users(id),
				FOREIGN KEY (id_checker) REFERENCES users(id)
			);
		`,
		`
			CREATE TABLE IF NOT EXISTS ratings (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				id_news INTEGER NOT NULL,
				id_user INTEGER NOT NULL,
				rating INTEGER NOT NULL,
				FOREIGN KEY (id_news) REFERENCES news(id),
				FOREIGN KEY (id_user) REFERENCES users(id)
			);
		`,
		`
			CREATE TABLE IF NOT EXISTS favorites (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				id_user INTEGER NOT NULL,
				id_news INTEGER NOT NULL,
				FOREIGN KEY (id_user) REFERENCES users(id),
				FOREIGN KEY (id_news) REFERENCES news(id)
			);
		`,
		`
			CREATE TABLE IF NOT EXISTS comments (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				id_news INTEGER NOT NULL,
				id_user INTEGER NOT NULL,
				content TEXT NOT NULL,
				timestamp TIMESTAMP NOT NULL,
				FOREIGN KEY (id_news) REFERENCES news(id),
				FOREIGN KEY (id_user) REFERENCES users(id)
			);
		`
	];
	var promise;

	for (const element of query) {
		promise = await execQuery(database, element );
	}

	return promise;
}

async function execQuery (database, query ) {
	return await database.run( query );
}

export default { up };
