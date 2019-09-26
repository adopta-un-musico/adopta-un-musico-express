/* eslint-disable no-underscore-dangle */
const express = require('express');
const Band = require('../models/Band');
const Chat = require('../models/Chat_model');

const router = express.Router();

router.get('/:bandId/:currentUser/:bandname', async (req, res, next) => {
  
  const { bandId, currentUser, bandname } = req.params;

  try {
    const band = await Band.findById(bandId).populate('members');
    const messages = await Chat.find({ room: bandname });
    const ifBandMember = band.members.filter((element) => {
      if (req.session.currentUser._id === element._id.toString()) {
        return true;
      }
    });
    console.log(messages);
    res.render('chat', { currentUser, band, ifBandMember, messages });
  } catch (error) {

    next(error);
  }
});

module.exports = router;