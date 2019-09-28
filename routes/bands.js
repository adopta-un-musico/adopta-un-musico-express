/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
const express = require("express");
const NodeGeocoder = require("node-geocoder");
const Band = require("../models/Band");
const User = require("../models/User");
const Events = require("../models/Events");
const Notification = require("../models/Notifications");

const router = express.Router();

const options = {
  provider: "google",
  httpAdapter: "https",
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};

const geocoder = NodeGeocoder(options);

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
  const { name, musicalGenres } = req.body;
  try {
    // eslint-disable-next-line no-unused-vars
    geocoder.geocode(req.body.location, async (err, data) => {
      if (err || !data.length) {
        req.flash("error", "La dirección no es válida");
        res.redirect("back");
      }
      const lat = data[0].latitude;
      const lgt = data[0].longitude;
      const location = data[0].formattedAddress;
      const band = await Band.create({
        bandname: name,
        location,
        lat,
        lgt,
        musicalGenres,
        manager: userId
      });
      const push = await Band.findByIdAndUpdate(band._id, {
        $push: { members: userId }
      });
      req.flash("info", "Banda creada correctamente");
      res.redirect("/home");
    });
  } catch (error) {
    next(error);
  }
});

router.get("/profile/:bandId", async (req, res, next) => {
  const { bandId } = req.params;

  try {
    const band = await Band.findById(bandId).populate("members");
    if (band !== null) {
      const isMe = req.session.currentUser._id === band.manager.toString();
      // Comprobamos si el usuario ya es miembro de la banda.
      const ifBand = band.members.filter(element => {
        if (req.session.currentUser._id === element._id.toString()) {
          return true;
        }
      });
      // Comprobamos si la petición ya ha sido enviada a la banda.
      const ifPetition = band.petitions.filter(element => {
        if (req.session.currentUser._id === element._id.toString()) {
          return true;
        }
      });
      const ifOpenRequest = band.requests === "Abiertas";
      const event = await Events.find({ event_manager: band._id });
      res.render("band_profile", {
        band,
        isMe,
        ifBand,
        event,
        ifPetition,
        ifOpenRequest
      });
    } else {
      const noBand = "La banda no existe o no está creada.";
      res.render("band_profile", { noBand });
    }
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
  const { name, musicalGenres, petitions } = req.body;
  try {
    geocoder.geocode(req.body.location, async (err, data) => {
      if (err || !data.length) {
        req.flash("error", "La dirección no es válida");
        res.redirect("back");
      }
      const lat = data[0].latitude;
      const lgt = data[0].longitude;
      const location = data[0].formattedAddress;
      const band = await Band.findByIdAndUpdate(bandId, {
        bandname: name,
        location,
        lat,
        lgt,
        musicalGenres,
        requests: petitions
      });
      req.flash("info", "Banda actualizada correctamente");
      res.redirect(`/bandas/profile/${bandId}`);
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:bandId/delete", async (req, res, next) => {
  const { bandId } = req.params;

  try {
    const band = await Band.findByIdAndDelete(bandId);
    req.flash("info", "Banda eliminada correctamente");
    res.redirect("/bandas/all");
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
    res.redirect("/bandas/all");
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
    res.redirect("/bandas/all");
  } catch (error) {
    next(error);
  }
});
router.get("/petition/:bandId/:userId", async (req, res, next) => {
  const { bandId, userId } = req.params;

  try {
    const band = await Band.findByIdAndUpdate(bandId, {
      $push: { petitions: userId }
    });
    req.flash("info", "La peticion ha sido enviada a la banda");
    res.redirect(`/bandas/profile/${bandId}`);
  } catch (error) {
    next(error);
  }
});
router.get("/petitionc/:bandId/check", async (req, res, next) => {
  const { bandId } = req.params;

  try {
    const petitions = await Band.findById(bandId).populate("petitions");
    res.render("all_petitions", { petitions, bandId });
  } catch (error) {
    next(error);
  }
});
router.get("/decline/:userId/:bandId/user", async (req, res, next) => {
  const { userId, bandId } = req.params;

  try {
    const band = await Band.findByIdAndUpdate(bandId, {
      $pull: { petitions: userId }
    });
    const notifications = await Notification.create({
      receiver: userId,
      sender_band: bandId,
      message: "ha rechazado tu petición"
    });
    req.flash("info", "Usuario rechazado");
    res.redirect("/bandas/all");
  } catch (error) {
    next(error);
  }
});

router.get("/accept/:userId/:bandId/user", async (req, res, next) => {
  const { userId, bandId } = req.params;

  try {
    const band = await Band.findByIdAndUpdate(bandId, {
      $push: { members: userId }
    });
    const pull = await Band.findByIdAndUpdate(bandId, {
      $pull: { petitions: userId }
    });
    const notifications = await Notification.create({
      receiver: userId,
      sender_band: bandId,
      message: "ha aceptado tu petición"
    });
    req.flash("info", "Usuario Aceptado");
    res.redirect("/bandas/all");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
