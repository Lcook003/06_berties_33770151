// routes/books.js - books list, add, bargain, search

var express = require('express');
var router = express.Router();

// List all books
router.get('/list', function (req, res, next) {
  let sqlquery = 'SELECT * FROM books';
  db.query(sqlquery, (err, result) => {
    if (err) {
      return next(err);
    }
    res.render('list.ejs', { availableBooks: result });
  });
});

// Show "Add book" form
router.get('/addbook', function (req, res) {
  res.render('addbook.ejs');
});

// Handle "Add book" form
router.post('/bookadded', function (req, res, next) {
  let sqlquery = 'INSERT INTO books (name, price) VALUES (?, ?)';

  let newrecord = [req.body.name, req.body.price];

  db.query(sqlquery, newrecord, (err, result) => {
    if (err) {
      return next(err);
    } else {
      res.send(
        ' This book is added to database, name: ' +
          req.body.name +
          ' price ' +
          req.body.price
      );
    }
  });
});

// Bargain books (< £20)
router.get('/bargainbooks', function (req, res, next) {
  let sqlquery = 'SELECT * FROM books WHERE price < 20.00';
  db.query(sqlquery, (err, result) => {
    if (err) {
      return next(err);
    }
    res.render('bargainbooks.ejs', { bargainBooks: result });
  });
});

// Search (basic + advanced using LIKE)
router.get('/search', function (req, res, next) {
  const keyword = req.query.keyword;

  if (!keyword) {
    // initial load: just form
    return res.render('search.ejs', { keyword: '', books: [] });
  }

  let sqlquery = 'SELECT * FROM books WHERE name LIKE ?';
  let searchTerm = '%' + keyword + '%';

  db.query(sqlquery, [searchTerm], (err, result) => {
    if (err) {
      return next(err);
    }
    res.render('search.ejs', { keyword: keyword, books: result });
  });
});

module.exports = router;
