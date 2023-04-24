var express = require('express');
var router = express.Router();
const fs = require('fs');
const path = require('path');
var emails = path.resolve('./json/emails.json')

/* GET users listing. */
router.get('/register', function(req, res, next) {
  res.status(200).render('register')
});

router.post('/add', function(req, res) {
  const email = req.body.email;
	var objEmails
  
  fs.readFile(emails, 'utf-8', (err, data) => {
    if (err) throw err;
    objEmails = JSON.parse(data);
  });
  json.newProperty = "email";
  objEmails.push(email);
  fs.writeFile(emails, JSON.stringify(objEmails), 'utf-8', (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
});
  res.redirect('/');
});
/*
app.get('/list', function(req, res) {
  const filePath = path.join(__dirname, 'emails.json');
  const emails = JSON.parse(fs.readFileSync(filePath));
  res.render('list', { emails });
}); */

module.exports = router;
