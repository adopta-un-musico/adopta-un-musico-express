const express = require("express");
const Band = require("../models/Band");
const User = require("../models/User");

const router = express.Router();

router.get("/all", async (req, res, next) => {
  try {
    const bands = await Band.find();
    res.render("all_bands", { bands });
  } catch (error) {
    next(error);
  }
});

router.get("/:userId", (req, res, next) => {
  res.render("create_band");
});

router.post("/:userId/new", async (req, res, next) => {
  const { userId } = req.params;
  const { name, location, musicalGenres } = req.body;
  try {
    // eslint-disable-next-line no-unused-vars
    const band = await Band.create({
      bandname: name,
      musicalGenres,
      location,
      manager: userId
    });
    req.flash("info", "Banda creada correctamente");
    res.redirect("/home");
  } catch (error) {
    next(error);
  }
});

router.get("/profile/:bandId", async (req, res, next) => {
  const { bandId } = req.params;

  try {
    const band = await Band.findById(bandId).populate("members");
    const isMe = req.session.currentUser._id === band.manager.toString();
    const ifBand = band.members.filter(element => {
      if (req.session.currentUser._id === element._id.toString()) {
        return true;
      }
    });
    res.render("band_profile", { band, isMe, ifBand });
  } catch (error) {
    next(error);
  }
});

router.get("/:bandId/update", async (req, res, next) => {
  const { bandId } = req.params;
  try {
    const band = await Band.findById(bandId);
    res.render("band_update", { band });
  } catch (error) {
    next(error);
  }
});

router.post("/:bandId/update_band", async (req, res, next) => {
  const { bandId } = req.params;
  const { name, location, musicalGenres } = req.body;

  try {
    // eslint-disable-next-line no-unused-vars
    const band = await Band.findByIdAndUpdate(bandId, {
      bandname: name,
      location,
      musicalGenres
    });
    req.flash("info", "Banda Actualizada correctamente");
    res.redirect(`/bandas/profile/${bandId}`);
  } catch (error) {
    next(error);
  }
});

router.get("/:bandId/delete", async (req, res, next) => {
  const { bandId } = req.params;

  try {
    const band = await Band.findByIdAndDelete(bandId);
    req.flash("info", "Banda eliminada correctamente");
    res.redirect(`/bandas/all`);
  } catch (error) {
    next(error);
  }
});
router.get("/:bandId/:userId", async (req, res, next) => {
  const { bandId, userId } = req.params;

  try {
    const band = await Band.findByIdAndUpdate(bandId, {
      $push: { members: userId }
    });
    req.flash("info", "Te has añadido a la banda correctamente");
    res.redirect(`/bandas/all`);
  } catch (error) {
    next(error);
  }
});
router.get("/:bandId/:userId/leave", async (req, res, next) => {
  const { bandId, userId } = req.params;

  try {
    const band = await Band.findByIdAndUpdate(bandId, {
      $pull: { members: userId }
    });
    req.flash("info", "Has salido  correctamente de la banda");
    res.redirect(`/bandas/all`);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
