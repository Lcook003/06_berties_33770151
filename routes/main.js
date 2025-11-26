// routes/main.js - home and about

var express = require('express');
var router = express.Router();

// Lab 8a - authorisation helper
const redirectLogin = (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect('/users/login');
  }
  next();
};

router.get('/', function (req, res) {
  res.render('index.ejs');
});

router.get('/about', function (req, res) {
  res.render('about.ejs');
});

router.get('/logout', redirectLogin, (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.redirect('/');
    }
    res.send("You are now logged out. <a href='/'>Home</a>");
  });
});

module.exports = router;
