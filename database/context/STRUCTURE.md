### Geral Vision Tables Structure

- users(id, nickname, email, password, birth, description, administrator);
- news(id, id_user, title, description, release, likes, image, link, verified);
- audits(id, id_news, id_author, id_checker, timestamp);
- ratings(id, id_news, id_user, rating);
- favorites(id, id_user, id_news);
- comments(id, id_news, id_user, content, timestamp);

### Comands for create all Database SQL Tables

```SQL

	CREATE TABLE IF NOT EXISTS users (
		id INT PRIMARY KEY AUTO_INCREMENT,
		nickname VARCHAR(100) NOT NULL,
		email VARCHAR(100) NOT NULL,
		password VARCHAR(100) NOT NULL,
		birth DATE NOT NULL,
		description TEXT NOT NULL,
		administrator BOOLEAN DEFAULT(0) NOT NULL
	);

	CREATE TABLE IF NOT EXISTS news (
		id INT PRIMARY KEY AUTO_INCREMENT,
		id_user INT NOT NULL,
		title VARCHAR(200) NOT NULL,
		description TEXT NOT NULL,
		release DATE NOT NULL,
		likes INT DEFAULT(0) NOT NULL,
		image VARCHAR(100) NOT NULL,
		link VARCHAR(100) NOT NULL,
		verified BOOLEAN DEFAULT(0) NOT NULL,
		FOREIGN KEY (id_user) REFERENCES users(id)
	);

	CREATE TABLE IF NOT EXISTS audits (
		id INT PRIMARY KEY AUTO_INCREMENT,
		id_news INT NOT NULL,
		id_author INT NOT NULL,
		id_checker INT NOT NULL,
		timestamp TIMESTAMP NOT NULL,
		FOREIGN KEY (id_news) REFERENCES news(id),
		FOREIGN KEY (id_author) REFERENCES users(id),
		FOREIGN KEY (id_checker) REFERENCES users(id)
	);

	CREATE TABLE IF NOT EXISTS ratings (
		id INT PRIMARY KEY AUTO_INCREMENT,
		id_news INT NOT NULL,
		id_user INT NOT NULL,
		rating INT NOT NULL,
		FOREIGN KEY (id_news) REFERENCES news(id),
		FOREIGN KEY (id_user) REFERENCES users(id)
	);

	CREATE TABLE IF NOT EXISTS favorites (
		id INT PRIMARY KEY AUTO_INCREMENT,
		id_user INT NOT NULL,
		id_news INT NOT NULL,
		FOREIGN KEY (id_user) REFERENCES users(id),
		FOREIGN KEY (id_news) REFERENCES news(id)
	);

	CREATE TABLE IF NOT EXISTS comments (
		id INT PRIMARY KEY AUTO_INCREMENT,
		id_news INT NOT NULL,
		id_user INT NOT NULL,
		content TEXT NOT NULL,
		timestamp TIMESTAMP NOT NULL,
		FOREIGN KEY (id_news) REFERENCES news(id),
		FOREIGN KEY (id_user) REFERENCES users(id)
	);
```

### Paths

- [Code PlantUML](./PlantTextUML.pu) for generate a graphic conceitual model in [PlantText Conversor](https://www.planttext.com/)

# Título de nível 1

## Título de nível 2

### Título de nível 3

- Item 1
- Item 2
  - Subitem 2.1
  - Subitem 2.2

1. Item A
2. Item B
   _Texto em itálico_
   _Outro texto em itálico_
   **Texto em negrito**
   **Outro texto em negrito**
   [Texto do link](https://www.exemplo.com)
   ![Texto alternativo](caminho/para/imagem.jpg)
   > Esta é uma citação em bloco.
   > Ela pode ocupar várias linhas.

---

Você pode usar o comando `git commit` para confirmar suas alterações.

```
\`javascript
function exemplo() {
console.log("Isso é um exemplo");
}
```

| Coluna 1 | Coluna 2 |
| -------- | -------- |
| Valor 1  | Valor 2  |
| Valor 3  | Valor 4  |
