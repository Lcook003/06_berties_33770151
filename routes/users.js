// routes/users.js - registration, password hashing, login, audit

const express = require('express');
const bcrypt = require('bcrypt');

const router = express.Router();
const saltRounds = 10;

// Lab 8a - authorisation helper
const redirectLogin = (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect('./login');
  }
  next();
};

// Lab 8b - validator import
const { check, validationResult } = require('express-validator');

// registeraton

// registration form
router.get('/register', (req, res) => {
  res.render('register.ejs');
});

// Handling registration
router.post(
  '/registered',
  [
    check('email').isEmail(),
    check('username').isLength({ min: 5, max: 20 }),
    check('password').isLength({ min: 8 })
  ],
  (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('register.ejs'); 
    }

    // Lab 8b sanitisation
    const username = req.sanitize(req.body.username);
    const first = req.sanitize(req.body.first);
    const last = req.sanitize(req.body.last);
    const email = req.sanitize(req.body.email);
    const password = req.sanitize(req.body.password);

    bcrypt.hash(password, saltRounds, function (err, hashedPassword) {
      if (err) return next(err);

      let sqlquery =
        'INSERT INTO users (username, first_name, last_name, email, hashedPassword) VALUES (?,?,?,?,?)';
      let values = [username, first, last, email, hashedPassword];

      db.query(sqlquery, values, (err, result) => {
        if (err) return next(err);

        res.send(`
          Hello ${first} ${last}, you are now registered.<br>
          Email: ${email}<br>
          Your username: ${username}<br>
          (Password hashed securely)
        `);
      });
    });
  }
);

// List users 

router.get('/list', redirectLogin, (req, res, next) => {
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
          req.session.userId = req.body.username;
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

router.get('/audit', redirectLogin, (req, res, next) => {
  const sql = 'SELECT * FROM audit_log ORDER BY log_time DESC, id DESC';
  db.query(sql, (err, result) => {
    if (err) {
      return next(err);
    }
    res.render('audit.ejs', { entries: result });
  });
});

// Logout - accessed as /users/logout because this router is mounted on /users
router.get('/logout', redirectLogin, (req, res) => {
  req.session.destroy(err => {
    if (err) {
      // If something goes wrong destroying the session, redirect to login
      return res.redirect('./login');
    }
    res.send("You are now logged out. <a href=\"/users/login\">Login again</a>");
  });
});

module.exports = router;
