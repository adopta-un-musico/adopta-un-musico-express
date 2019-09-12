const express = require("express");
const router = express.Router();
const Band = require("../models/Band");

router.get("/all", function(req, res, next) {
  Band.find()
    .then(bands => {
      res.render("all_bands", { bands });
    })
    .catch(next);
});
router.get("/:userId", function(req, res, next) {
  res.render("create_band");
});

router.post("/:userId/new", function(req, res, next) {
  const { userId } = req.params;
  const { name, location, musicalGenres } = req.body;

  Band.create({
    bandname: name,
    musicalGenres: musicalGenres,
    location: location,
    manager: userId
  })
    .then(band => {
      req.flash("info", "Banda creada correctamente");
      res.redirect("/home");
    })
    .catch(next);
});
router.get("/profile/:bandId", function(req, res, next) {
  const { bandId } = req.params;

  Band.findById(bandId).then(band => {
    console.log(band);
    res.render("band_profile", { band });
  });
});
module.exports = router;
