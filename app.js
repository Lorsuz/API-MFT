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
app.use((req, res, next) => {
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
  if (!req.session.loggedIn || req.session.loggedIn == undefined || req.session.loggedIn == null) {
    req.session.loggedIn = false
  }
  loggedIn = req.session.loggedIn
  msg = 'notícias encontradas'
  
  query = ''
  search = req.query.search
  reqArray = []
  if (!search || search == undefined || search == null || search == '') {
    query = 'SELECT * FROM cardnews'
    search =''
  }else{
    tratSearch = `%${search}%`
    reqArray = [tratSearch]
    query = `SELECT * FROM cardnews WHERE title LIKE ?`
  }
  console.log(reqArray);

  connection.query(
    query,
    reqArray,
    (error, results) => {
      if (error) {

      }
      if(results == undefined){
        results = []
        msg = 'result nao existe'
      }else if (results.length == 1) {
        msg = 'notícia encontrada'
      } 

      results.forEach(card => {
        card.date = format(card.date, 'dd/MM/yyyy')
      });

      res.render('./index', { loggedIn, totalCards: results.length, plural: msg, cards: results, search: search });

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
  res.render('./sign-acount', { errorAction: "" })
});

app.get('/user/login', (req, res) => {
  res.render('./login-acount', { errorAction: '' })
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
app.get('/news/read/:id', (req, res, next) => {
  id = req.params.id
  connection.query(
    "SELECT * FROM cardnews WHERE id = ?",
    [id],
    (error, results) => {
      if (error) {

      }
      if(results == undefined){
        results = []
        msg = 'result nao existe'
      }else if (results.length == 1) {
        msg = 'notícia encontrada'
      } 

      results.forEach(card => {
        card.date = format(card.date, 'dd/MM/yyyy')
      });

      res.render('./index', { loggedIn, totalCards: results.length, plural: msg, cards: results, search: search });

    })
})

app.post('/user/register', (req, res) => {
  const { nickname, email, password, birth, description } = req.body;
  var errorAction = ''
  // if (!nickname || !email || !password) {
  //   return res.status(400).send('Nickname, email e password são obrigatórios.');
  // }

  connection.query(
    'SELECT * FROM users WHERE email = ?',
    [email],
    (error, LetResults) => {

      if (LetResults.length == 0) {

        connection.query(
          'INSERT INTO users (nickname, email, password, birth, description) VALUES (?, ?, ?, ?, ?)',
          [nickname, email, password, birth, description],
          (error, result) => {
            if (error) {
              errorAction = "ocorreu algum erro durante a execusão"
            }
            if (errorAction != '') {
              res.render('./sign-acount', { errorAction});
            }else{
            req.session.loggedIn = true;
            req.session.user = result[0];
            res.redirect('/');
          }
          }
        );
      }else{
        errorAction = "Esse email já está em uso"
        res.render('./sign-acount', { errorAction});
      }
    }
  );


});

app.post('/user/login', (req, res) => {
  const { email, password } = req.body;
  var errorAction = ''

  connection.query(
    'SELECT * FROM users WHERE email = ?',
    [email],
    (error, letResults) => {
      if (error) {
        errorAction = "ocorreu algum erro durante a execusão"
      }
      console.log(letResults)
      if (letResults.length == 1) {

        connection.query(
          'SELECT * FROM users WHERE email = ? AND password = ?',
          [email, password],
          (error, results) => {
            if (error) {
              errorAction = "ocorreu algum erro durante a execusão"
            }
            if (results.length == 1) {
              req.session.loggedIn = true;
              req.session.user = results[0];
              res.redirect('/')
            }else {
              errorAction = 'senha incorreta'
              res.render('./login-acount', { errorAction });

            }
          }
        );

      }else {
        errorAction = 'Não existe nenhum cadastro com esse email'
      }
      if (errorAction != '') {
        res.render('./login-acount', { errorAction });
      }
     } )


});

app.post('/news/add', (req, res, next) => {
  const { title, description, date, image, link } = req.body;
  const id_user = req.session.user.id
  // if (!nickname || !email || !password) {
  //   return res.status(400).send('Nickname, email e password são obrigatórios.');
  // }

  connection.query(
    'INSERT INTO cardnews (id_user,	title,	description,	date,	image,	link) VALUES (?, ?, ?, ?, ?, ?)',
    [id_user, title, description, date, image, link],
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
