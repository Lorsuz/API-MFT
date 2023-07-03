import multer from 'multer';
import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import flash from 'connect-flash';
import path from 'path';
import crypto from 'crypto';
import { promises as fs } from 'fs';
import { parseISO, format } from 'date-fns';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import Model from '../../models/Model.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));
router.use(cookieParser());
router.use(
  session({
    secret: 'minhachavesecreta',
    resave: false,
    saveUninitialized: true
  })
);

router.use(flash());
router.use((req, res, next) => {
  res.locals.sucess_msg = req.flash('sucess_msg');
  res.locals.error_msg = req.flash('error_msg');
  next();
});

class HTTPError extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
  }
}

export default { router, Model, fs, parseISO, crypto, format, HTTPError };
