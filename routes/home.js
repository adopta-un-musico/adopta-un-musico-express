const express = require('express');
const User = require('../models/User');
const Band = require('../models/Band');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    // eslint-disable-next-line no-underscore-dangle
    const user = await User.findById(req.session.currentUser._id);
    const bands = await Band.find({location: user.location});
    console.log(bands, "user: " + user);
    res.render('home', { user });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
