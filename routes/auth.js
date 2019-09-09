const express = require('express');
const bcrypt = require('bcryptjs');

const User = require('../models/User');

const bcryptSalt = 10;

const router = express.Router();

router.get('/signup', (req, res, next) => {
    res.render('signup'); 
  });
  
router.post('/newUser', (req, res , next) =>{

    const { email, password } = req.body;
    if (email !== '' && password !== '') {
        User.findOne({ email })
          .then((user) => {
            if (user) {
              res.render('signup', { error: 'El usuario que has introducido ya existe' });
            } else {
              const salt = bcrypt.genSaltSync(bcryptSalt);
              const hashedPassword = bcrypt.hashSync(password, salt);
              User.create({ email, hashedPassword })
                .then(() => {
                  res.redirect('/home');
                })
                .catch((error) => {
                  throw error;
                });
            }
          })
          .catch((error) => {
            res.render('signup', { error: 'error vuelve a intentarlo' });
          });
      } else {
        res.render('signup', { error: 'Los campos no pueden estar vacios' });
      }
});



router.get('/login', (req, res, next) => {

  res.render('login'); 
});



router.post('/login', (req, res, next) => {

  const { email, password } = req.body;
  if (email !== '' && password !== '') {
    User.findOne({ email })
      .then((user) => {
        if (user) {
          if (bcrypt.compareSync(password, user.hashedPassword)) {
            req.session.currentUser = user;
            res.redirect('/home');
          } else {
            res.render('login', { error: 'usuario o contraseña incorrectos' });
          }
        } else {
          res.redirect('/signup');
        }
      })
      .catch(() => {
        res.render('login', { error: 'error vuelve a intentarlo' });
      });
  } else {
    res.render('login', { error: 'Los campos no pueden estar vacios' });
  }
});


router.get('/logout', (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      next(err);
    }
    res.redirect('/login');
  });
});

module.exports = router;