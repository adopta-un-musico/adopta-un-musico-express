const express = require('express');
const User = require('../models/User');

const router = express.Router();

router.post('/', async (req, res, next) => {
  const { search } = req.body;
  try {
    const users = await User.find({ nickname: search });
    res.render('search', { users });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
