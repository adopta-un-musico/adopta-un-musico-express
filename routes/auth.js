const express = require('express');
const bcrypt = require('bcryptjs');

const User = require('../models/User');

const bcryptSalt = 10;

const router = express.Router();

router.get('/signup', (req, res, next) => {
  res.render('signup');
});

router.post('/newUser', (req, res, next) => {
  const { email, password, nickname } = req.body;
  if (email !== '' && password !== '') {
    User.findOne({ email })
      .then(user => {
        if (user) {
          req.flash('error', 'El usuario que has introducido ya existe');
          res.redirect('/signup');
        } else {
          const salt = bcrypt.genSaltSync(bcryptSalt);
          const hashedPassword = bcrypt.hashSync(password, salt);
          User.create({ email, hashedPassword, nickname })
            .then(user => {
              req.session.currentUser = user;
              req.flash('info', 'Usuario creado correctamente');
              res.redirect('/home');
            })
            .catch(error => {
              throw error;
            });
        }
      })
      .catch(error => {
        req.flash('error', 'error vuelve a intentarlo');
        res.redirect('/signup');
      });
  } else {
    req.flash('error', 'Los campos no pueden estar vacios');
    res.redirect('/signup');
  }
});

router.get('/login', (req, res, next) => {
  res.render('login');
});

router.post('/login', (req, res, next) => {
  const { email, password } = req.body;
  if (email !== '' && password !== '') {
    User.findOne({ email })
      .then(user => {
        if (user) {
          if (bcrypt.compareSync(password, user.hashedPassword)) {
            req.session.currentUser = user;
            res.redirect('/home');
          } else {
            req.flash('error', 'Usuario o contraseña inmcorrectos');
            res.redirect('/login');
          }
        } else {
          res.redirect('/signup');
        }
      })
      .catch(() => {
        req.flash('error', 'Vuelve a intentarlo');
        res.redirect('/login');
      });
  } else {
    req.flash('error', 'Los campos no pueden estar vacios');
    res.redirect('/login');
  }
});

router.get('/logout', (req, res, next) => {
  req.session.destroy(err => {
    if (err) {
      next(err);
    }
    res.redirect('/login');
  });
});

module.exports = router;
