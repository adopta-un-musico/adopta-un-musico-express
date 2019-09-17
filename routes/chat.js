const express = require('express');
const Band = require("../models/Band");

const router = express.Router();

router.get('/:bandId/:currentUser', async (req, res, next) => {
  
  const { bandId, currentUser } = req.params;

  try {
    const band = await Band.findById(bandId).populate("members")
    console.log(band);
    const ifBandMember = band.members.filter(element => {
      if (req.session.currentUser._id === element._id.toString()) {
        return true;
      }
    });
    res.render('chat', { currentUser, band, ifBandMember});
  } catch (error) {

    next(error)
  }
  
});

module.exports = router;