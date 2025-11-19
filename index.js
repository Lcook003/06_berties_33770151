// index.js - main entrypoint for Berties Books (Labs 6 & 7)

require('dotenv').config(); // load .env if present

var express = require('express');
var ejs = require('ejs');
var mysql = require('mysql2');

var app = express();
var port = 8000;

// View engine
app.set('view engine', 'ejs');

// Parse form data
app.use(express.urlencoded({ extended: true }));

// Serve static files (CSS)
app.use(express.static('public'));

// Database connection pool (uses dotenv with sensible defaults)
const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'berties_books_app',
  password: process.env.DB_PASSWORD || 'qwertyuiop',
  database: process.env.DB_NAME || 'berties_books',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Make db visible in routes
global.db = db;

// Routes
const mainRoutes = require('./routes/main');
const bookRoutes = require('./routes/books');
const userRoutes = require('./routes/users');

app.use('/', mainRoutes);
app.use('/books', bookRoutes);
app.use('/users', userRoutes);

app.listen(port, () => {
  console.log(`Berties Books app listening on port ${port}!`);
});
