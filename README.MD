### Banco de dados

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nickname VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  password VARCHAR(100) NOT NULL,
  birth DATE,
  description TEXT
);
CREATE TABLE cardnews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_user INT NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  date DATE,
  likes INT DEFAULT(0),
  image TEXT,
  link TEXT,
  FOREIGN KEY (id_user) REFERENCES users(id)
);