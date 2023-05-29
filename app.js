var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const { format } = require('date-fns');

var app = express();

app.use(session({
  secret: 'minhachavesecreta',
  resave: false,
  saveUninitialized: true
}));
app.use(flash())
app.use((req,res,next)=>{
  res.locals.sucess_msg = req.flash("sucess_msg")
  res.locals.error_msg = req.flash("error_msg")
  next()
})

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/* =================================================================== */

const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'existindonews'
});

connection.connect((error) => {
  if (error) {
    console.error('Erro ao conectar ao banco de dados:', error);
  } else {
    console.log('Conexão bem-sucedida ao banco de dados!');
  }
});

/* ==================================================================== */

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

/* ==================================================================== */

app.get('/', (req, res, next) => {
  if(!req.session.loggedIn || req.session.loggedIn == undefined || req.session.loggedIn == null){
    req.session.loggedIn = false
  }
  loggedIn = req.session.loggedIn
  msg = 'notícias encontradas'

  connection.query(
    'SELECT * FROM cardnews',
    [],
    (error, results) => {
      if (error) {

      }
      if(results.length == 1){
        msg = 'notícia encontrada'
      }

      results.forEach(card => {
        card.date = format(card.date, 'dd/MM/yyyy')
      });

      res.render('./index', {loggedIn, totalCards: results.length, plural: msg, cards: results});
      
    })

});

app.get('/users', (req, res) => {
  connection.query('SELECT * FROM users', (error, results) => {
    if (error) {
      console.error('Erro ao executar consulta:', error);
      return res.status(500).send('Erro ao recuperar usuários');
    }

    res.json(results);
  });
});

app.get('/user/register', (req, res) => {
  res.render('./sign-acount')
});

app.get('/user/login', (req, res) => {
  res.render('./login-acount')
});

app.get('/user/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/');
    }
  });
});

app.get('/news/add', (req, res, next) => {
  res.render('./form-news')

})

app.post('/news/add', (req, res, next) => {
  const {	title,	description,	date,	image,	link } = req.body;
  const id_user = req.session.user.id
  // if (!nickname || !email || !password) {
  //   return res.status(400).send('Nickname, email e password são obrigatórios.');
  // }

  connection.query(
    'INSERT INTO cardnews (id_user,	title,	description,	date,	image,	link) VALUES (?, ?, ?, ?, ?, ?)',
    [id_user,	title,	description,	date,	image,	link],
    (error, result) => {
      if (error) {
        console.error('Erro ao adicionar noticia:', error);
        return res.status(500).send('Erro ao adicionar Noticia.');
      }
      
      connection.query(
        'SELECT * FROM cardnews WHERE title = ? OR description = ? OR link = ?',
        [title, description, link],
        (error, results) => {
          if (error) {
    
          }
    
          if (results.length == 0) {
    
            res.redirect('/');
          } else {
            // res.render('./form-news', { error: 'Credenciais inválidas' });
            res.redirect('/');
          }
        }
      );

    }
    );
})

app.post('/user/register', (req, res) => {
  const { nickname, email, password, birth, description } = req.body;

  if (!nickname || !email || !password) {
    return res.status(400).send('Nickname, email e password são obrigatórios.');
  }

  connection.query(
    'INSERT INTO users (nickname, email, password, birth, description) VALUES (?, ?, ?, ?, ?)',
    [nickname, email, password, birth, description],
    (error, result) => {
      if (error) {
        console.error('Erro ao adicionar usuário:', error);
        return res.status(500).send('Erro ao adicionar usuário.');
      }

      // res.status(201).send('Usuário cadastrado com sucesso!');
      
      connection.query(
        'SELECT * FROM users WHERE email = ? AND password = ?',
        [email, password],
        (error, results) => {
          if (error) {
    
          }
    
          if (results.length == 1) {
            req.session.loggedIn = true;
            req.session.user = results[0];
    
            res.redirect('/');
          } else {
            res.render('./login-acount', { error: 'Credenciais inválidas' });
          }
        }
      );

    }
    );
});

app.post('/user/login', (req, res) => {
  const { email, password } = req.body;
  connection.query(
    'SELECT * FROM users WHERE email = ? AND password = ?',
    [email, password],
    (error, results) => {
      if (error) {

      }

      if (results.length == 1) {
        req.session.loggedIn = true;
        req.session.user = results[0];

        res.redirect('/');
      } else {

        res.render('./login-acount', { error: 'Credenciais inválidas' });
      }
    }
  );
});

/* ==================================================================== */

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);


app.use(function (req, res, next) {
  next(createError(404));
});


app.use(function (err, req, res, next) {

  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};


  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
