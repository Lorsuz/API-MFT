import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import flash from 'connect-flash';
import path from 'path';

import Users from '../../models/Users.js';
import News from '../../models/News.js';
import Ratings from '../../models/Ratings.js';
import Favorites from '../../models/Favorites.js';
import Comments from '../../models/Comments.js';
import Audits from '../../models/Audits.js';

import { parseISO, format } from 'date-fns';

var router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

router.use(session({
  secret: 'minhachavesecreta',
  resave: false,
  saveUninitialized: true
}));

router.use(flash())
router.use((req, res, next) => {
  res.locals.sucess_msg = req.flash("sucess_msg")
  res.locals.error_msg = req.flash("error_msg")
  next()
})

class HTTPError extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
  }
}

export default {router, Users, News, Ratings, Favorites, Comments, Audits, parseISO, format, HTTPError};