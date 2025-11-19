// routes/main.js - home and about

var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
  res.render('index.ejs');
});

router.get('/about', function (req, res) {
  res.render('about.ejs');
});

module.exports = router;
