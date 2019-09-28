/* eslint-disable no-underscore-dangle */
const express = require("express");
const NodeGeocoder = require("node-geocoder");
const Events = require("../models/Events");
const User = require("../models/User");

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
    const events = await Events.find().populate("event_manager");
    res.render("all_events", { events });
  } catch (error) {
    next(error);
  }
});

router.get("/detail/:eventId", async (req, res, next) => {
  const { eventId } = req.params;

  try {
    const event = await Events.find({ _id: eventId }).populate("event_manager");
    const eventToView = event[0];
    const totalRecommend = eventToView.recomendations;
    const result = totalRecommend.length;
    const isMe =
      req.session.currentUser._id ===
      eventToView.event_manager.manager.toString();

    // Comporbamos si el usuario ya ha recomendado este evento

    const ifRecommended = eventToView.recomendations.filter(element => {
      if (req.session.currentUser._id == element._id.toString()) {
        return true;
      }
    });

    // Comporbamos si el usuario ya ha marcado que asistirá al evento

    const ifuserWillAssist = eventToView.asistentes.filter(element => {
      if (req.session.currentUser._id == element._id.toString()) {
        return true;
      }
    });
    res.render("event_detail", {
      eventToView,
      isMe,
      ifRecommended,
      ifuserWillAssist,
      result
    });
  } catch (error) {
    next(error);
  }
});

router.get("/new/:bandId", async (req, res, next) => {
  const { bandId } = req.params;
  res.render("add_event", { bandId });
});

router.post("/:bandId/add", async (req, res, next) => {
  const { bandId } = req.params;
  const { name, date } = req.body;
  try {
    geocoder.geocode(req.body.location, async (err, data) => {
      if (err || !data.length) {
        req.flash("error", "La dirección no es válida");
        res.redirect("back");
      }
      const lat = data[0].latitude;
      const lgt = data[0].longitude;
      const location = data[0].formattedAddress;
      const event = await Events.create({
        event_manager: bandId,
        event_name: name,
        location,
        lat,
        lgt,
        date
      });
    });
    req.flash("info", "Evento creado correctamente");
    res.redirect(`/bandas/profile/${bandId}`);
  } catch (error) {
    next(error);
  }
});

router.get("/delete/:eventId", async (req, res, next) => {
  const { eventId } = req.params;

  try {
    const deletEvent = await Events.findByIdAndDelete(eventId);
    req.flash("info", "Evento eliminado correctamente");
    res.redirect("/bandas/all");
  } catch (error) {
    next(error);
  }
});

router.get("/recommend/:eventId", async (req, res, next) => {
  const { eventId } = req.params;
  try {
    const event = await Events.findByIdAndUpdate(eventId, {
      $push: { recomendations: req.session.currentUser._id }
    });
    res.redirect(`/events/detail/${eventId}`);
  } catch (error) {
    next(error);
  }
});
router.get("/join/:eventId", async (req, res, next) => {
  const { eventId } = req.params;
  try {
    const event = await Events.findByIdAndUpdate(eventId, {
      $push: { asistentes: req.session.currentUser._id }
    });
    res.redirect(`/events/detail/${eventId}`);
  } catch (error) {
    next(error);
  }
});
router.get("/leave/:eventId", async (req, res, next) => {
  const { eventId } = req.params;
  try {
    const event = await Events.findByIdAndUpdate(eventId, {
      $pull: { asistentes: req.session.currentUser._id }
    });
    res.redirect(`/events/detail/${eventId}`);
  } catch (error) {
    next(error);
  }
});
router.get("/norecommend/:eventId", async (req, res, next) => {
  const { eventId } = req.params;
  try {
    const event = await Events.findByIdAndUpdate(eventId, {
      $pull: { recomendations: req.session.currentUser._id }
    });
    res.redirect(`/events/detail/${eventId}`);
  } catch (error) {
    next(error);
  }
});

router.get("/update/:eventId", async (req, res, next) => {
  const { eventId } = req.params;
  try {
    const event = await Events.findById(eventId);
    res.render("update_event", { event });
  } catch (error) {
    next(error);
  }
});

router.post("/:eventId/upd", async (req, res, next) => {
  const { eventId } = req.params;
  const { name, date } = req.body;

  try {
    geocoder.geocode(req.body.location, async (err, data) => {
      if (err || !data.length) {
        req.flash("error", "La dirección no es válida");
        res.redirect("back");
      }
      const lat = data[0].latitude;
      console.log(lat);
      const lgt = data[0].longitude;
      console.log(lgt);
      const location = data[0].formattedAddress;
      const modifiedEvent = await Events.findByIdAndUpdate(eventId, {
        event_name: name,
        location,
        lat,
        lgt,
        date
      });
    });
    req.flash("info", "Evento modificado correctamente");
    res.redirect(`/events/detail/${eventId}`);
  } catch (error) {
    next(error);
  }
});
router.get("/:currentUser/recommendations", async (req, res, next) => {
  const { currentUser } = req.params;

  try {
    const user = await User.find({ nickname: currentUser });
    const recommendations = await Events.find({
      recomendations: user[0]._id
    }).populate("event_manager");
    res.render("my_recommendations", { recommendations });
  } catch (error) {
    next(error);
  }
});

router.get("/:currentUser/event", async (req, res, next) => {
  const { currentUser } = req.params;

  try {
    const user = await User.find({ nickname: currentUser });
    const iWillAssist = await Events.find({ asistentes: user[0]._id }).populate(
      "event_manager"
    );
    const username = await User.find({ nickname: currentUser });
    const userProfile = username[0];
    res.render("events", { iWillAssist, userProfile });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
