var express = require('express');
var router = express.Router();
var app = express()

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// router.get('/', function (req, res, next) {
//   res.render('index');
// });



module.exports = router;
