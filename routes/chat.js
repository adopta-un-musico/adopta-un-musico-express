const express = require('express');
const Band = require("../models/Band");

const router = express.Router();

router.get('/:bandId/:currentUser', async (req, res, next) => {
  
  const { bandId, currentUser } = req.params;

  try {
    const band = await Band.findById(bandId)
    res.render('chat', { currentUser, band});
  } catch (error) {

    next(error)
  }
  
});

module.exports = router;