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

module.exports = router;