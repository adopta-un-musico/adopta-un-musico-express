/* eslint-disable no-underscore-dangle */
const express = require('express');
const User = require('../models/User');
const Band = require('../models/Band');
const Events = require('../models/Events');
const Notifications = require('../models/Notifications');
const formidable = require('formidable');

const router = express.Router();

/* GET users listing. */
router.get('/:currentUser', async (req, res, next) => {
  const { currentUser } = req.params;
  try {
    const user = await User.find({nickname: currentUser });
    if (user) {
      const isMe = req.session.currentUser._id === user[0]._id.toString();
      const band = await Band.find({ members: user.id });
      const userProfile = user[0];
      const notificationsCount = await Notifications.find({
        receiver: req.session.currentUser._id,
        visited: 0,
      }).count();
      res.render('profile', {
        userProfile,
        isMe,
        band,
        notificationsCount,
      });
    }
  } catch (error) {
    next(error);
  }
});

router.get('/update/:currentUser', async (req, res, next) => {
  const { currentUser } = req.params;
  try {
    const user = await User.find({nickname: currentUser});
    const userProfile = user[0];
    res.render('update', { userProfile });
  } catch (error) {
    next(error);
  }
});

router.post('/:currentUser', async (req, res, next) => {
  const { currentUser } = req.params;

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
    const userId = await User.find({nickname: currentUser})
    const user = await User.findByIdAndUpdate(userId._id, {
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
