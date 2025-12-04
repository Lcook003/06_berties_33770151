const express = require('express');
const router = express.Router();

// BASIC BOOK API
router.get('/books', (req, res, next) => {

  let search = req.query.search;
  let minprice = req.query.minprice;
  let maxprice = req.query.maxprice;
  let sort = req.query.sort;

  let sql = "SELECT * FROM books";
  let params = [];

  // Search extension (Task 3)
  if (search) {
    sql += " WHERE name LIKE ?";
    params.push('%' + search + '%');
  }

  // Price range extension (Task 4)
  if (minprice && maxprice) {
    sql += search ? " AND" : " WHERE";
    sql += " price BETWEEN ? AND ?";
    params.push(minprice, maxprice);
  }

  // Sorting extension (Task 5)
  if (sort === "name") sql += " ORDER BY name";
  if (sort === "price") sql += " ORDER BY price";

  db.query(sql, params, (err, result) => {
    if (err) return res.json({ error: err });
    res.json(result);
  });
});

module.exports = router;
