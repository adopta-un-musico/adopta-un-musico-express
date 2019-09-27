/* eslint-disable no-underscore-dangle */
const express = require('express');
const User = require('../models/User');
const Band = require('../models/Band');
const Events = require('../models/Events');
const Notifications = require('../models/Notifications');
const formidable = require('formidable');

const router = express.Router();

/* GET users listing. */
router.get('/:userId', async (req, res, next) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (user) {
      const isMe = req.session.currentUser._id === user._id.toString();
      const band = await Band.find({ members: userId });
      const notificationsCount = await Notifications.find({
        receiver: req.session.currentUser._id,
        visited: 0,
      }).count();
      res.render('profile', {
        user,
        isMe,
        band,
        notificationsCount,
      });
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

  const {
    email,
    nickname,
    musicalGenres,
    instruments,
    loc,
  } = req.body;
  try {
    // eslint-disable-next-line no-unused-vars
    // const form = new formidable.IncomingForm();
    // form.parse(req);
    // form.on('fileBegin', function (name, file){
    //  file.path = __dirname + '/images/' + file.name;
    // });
    // const direction =  form.on('file', function (name, file){
    //  console.log('Uploaded ' + file.name);
    // });
    const user = await User.findByIdAndUpdate(userId, {
      email,
      nickname,
      musicalGenres,
      instruments,
      loc,
    });
    req.flash('info', 'Perfil Actualizado correctamente');
    res.redirect(`/profile/${userId}`);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
