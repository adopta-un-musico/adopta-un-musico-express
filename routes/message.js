const express = require('express');
const Message = require('../models/Messages');
const User = require('../models/User');

const router = express.Router();

router.get('/:currentUser/all', async (req, res, next) => {
  const { currentUser } = req.params;
  try {
    const messages = await Message.find({ receiver: req.session.currentUser._id }).populate(
      'sender',
    );
    res.render('all_messages', { messages });
  } catch (error) {
    next(error);
  }
});

router.get('/detail/:sender', async (req, res, next) => {
  const { sender } = req.params;
  try {
    const messages = await Message.find({ sender: sender }).populate('sender');
    const messageToView = messages[0];
    res.render('detail_messages', { messageToView });
  } catch (error) {
    next(error);
  }
});

router.get('/send/:userSender', (req, res, next) => {
  const { userSender } = req.params;
  res.render('send_message', { userSender });
});
router.post('/send/:receiver/:currentUser', async (req, res, next) => {
  const { receiver } = req.params;
  const { currentUser } = req.params;
  const { messageSend } = req.body;

  try {
    const messages = await Message.create({
      sender: currentUser,
      receiver: receiver,
      message: messageSend,
    });
    req.flash('info', 'Mensaje enviado!');
    res.redirect('/home');
  } catch (error) {
    next(error);
  }
});

module.exports = router;
