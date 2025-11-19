// routes/users.js - registration, password hashing, login, audit

const express = require('express');
const bcrypt = require('bcrypt');

const router = express.Router();
const saltRounds = 10;

// registeraton

// registration form
router.get('/register', (req, res) => {
  res.render('register.ejs');
});

// Handling registration
router.post('/registered', (req, res, next) => {
  const { username, first, last, email, password } = req.body;
  const plainPassword = password;

  if (!username || !plainPassword) {
    return res.status(400).send('Username and password are required.');
  }

  bcrypt.hash(plainPassword, saltRounds, function (err, hashedPassword) {
    if (err) {
      return next(err);
    }

    const sqlquery =
      'INSERT INTO users (username, first_name, last_name, email, hashedPassword) VALUES (?,?,?,?,?)';
    const newUser = [username, first, last, email, hashedPassword];

    db.query(sqlquery, newUser, (err2) => {
      if (err2) {
        return next(err2);
      }

      let result =
        'Hello ' +
        first +
        ' ' +
        last +
        ' you are now registered! We will send an email to you at ' +
        email +
        '.<br>';
      result +=
        'Your password is: ' +
        plainPassword +
        ' and your hashed password is: ' +
        hashedPassword;

      res.send(result);
    });
  });
});

// List users 

router.get('/list', (req, res, next) => {
  const sqlquery =
    'SELECT id, username, first_name, last_name, email FROM users';
  db.query(sqlquery, (err, result) => {
    if (err) {
      return next(err);
    }
    res.render('userslist.ejs', { users: result });
  });
});

// Login

// form
router.get('/login', (req, res) => {
  res.render('login.ejs', { message: null });
});

// handling login
router.post('/loggedin', (req, res, next) => {
  const { username, password } = req.body;

  const sqlquery = 'SELECT * FROM users WHERE username = ?';
  db.query(sqlquery, [username], (err, result) => {
    if (err) {
      return next(err);
    }

    if (result.length === 0) {
      logAudit(username, false, 'Login failed: user not found', () => {
        res.render('login.ejs', {
          message: 'Login failed: invalid username or password.'
        });
      });
    } else {
      const user = result[0];
      const hashedPassword = user.hashedPassword;

      bcrypt.compare(password, hashedPassword, (err2, match) => {
        if (err2) {
          return next(err2);
        }

        if (match === true) {
          logAudit(username, true, 'Login successful', () => {
            res.send(
              'Login successful. Welcome, ' +
                user.first_name +
                ' ' +
                user.last_name +
                '!'
            );
          });
        } else {
          logAudit(username, false, 'Login failed: incorrect password', () => {
            res.render('login.ejs', {
              message: 'Login failed: invalid username or password.'
            });
          });
        }
      });
    }
  });
});

// audit log

function logAudit(username, success, message, callback) {
  const sql =
    'INSERT INTO audit_log (username, success, message) VALUES (?,?,?)';
  db.query(sql, [username, success, message], (err) => {
    if (err) {
      console.error('Audit log insert failed:', err);
    }
    if (callback) callback();
  });
}

router.get('/audit', (req, res, next) => {
  const sql = 'SELECT * FROM audit_log ORDER BY log_time DESC, id DESC';
  db.query(sql, (err, result) => {
    if (err) {
      return next(err);
    }
    res.render('audit.ejs', { entries: result });
  });
});

module.exports = router;
