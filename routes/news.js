import {router} from './exports/router.js'

router.get('/news', (req, res, next) => {
  res.render('./form-news')
})

router.get('/news/create', (req, res, next) => {
  res.render('./form-news')
})

router.get('/news/read/:id', (req, res, next) => {
  id = req.params.id
  connection.query(
    "SELECT * FROM cardnews WHERE id = ?",
    [id],
    (error, results) => {
      if (error) {
        res.redrect('/')
      }
      if (results == undefined) {
        results = []
        msg = 'result nao existe'
      } else if (results.length == 1) {
        msg = 'notícia encontrada'
      }

      results.forEach(card => {
        card.date = format(card.date, 'dd/MM/yyyy')
      });

      res.render('./index', { loggedIn, totalCards: results.length, plural: msg, cards: results, search: search });

    })
})

/* ==================================================================== */

router.post('/news/create', (req, res, next) => {
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

export default router;