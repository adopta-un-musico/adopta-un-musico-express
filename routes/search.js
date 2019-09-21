const express = require('express');
const User = require('../models/User');

const router = express.Router();

/* GET search page. */
router.get('/', (req, res, next) => {
  res.render('search', { title: 'Search' });
});

router.post('/', async (req, res, next) => {
  console.log('dentro de ruta /search');
  const { search } = req.body;
  console.log(search);

  res.redirect('/search');
});


module.exports = router;
