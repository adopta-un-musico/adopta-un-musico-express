const express = require('express');
const User = require('../models/User');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    // eslint-disable-next-line no-underscore-dangle
    const user = await User.findById(req.session.currentUser._id);
    res.render('home', { user });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
