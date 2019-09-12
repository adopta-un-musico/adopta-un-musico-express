/* eslint-disable no-underscore-dangle */
const express = require('express');
const User = require('../models/User');
const Band = require('../models/Band');

const router = express.Router();

/* GET users listing. */
router.get('/:userId', async (req, res, next) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (user) {
      const isMe = req.session.currentUser._id === user._id.toString();
      const band = await Band.find({manager: userId});
      res.render('profile', { user, isMe, band});
    }
  } catch (error) {
    next(error);
  }
});

router.get('/update/:userId', async (req, res, next) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    res.render('update', { user });
  } catch (error) {
    next(error);
  }
});

router.post('/:userId', async (req, res, next) => {
  const { userId } = req.params;
  const { email, nickname } = req.body;
  try {
    // eslint-disable-next-line no-unused-vars
    const user = await User.findByIdAndUpdate(userId, { email, nickname });
    req.flash('info', 'Perfil Actualizado correctamente');
    res.redirect(`/profile/${userId}`);
  } catch (error) {
    next(error);
  }
});

module.exports = router;