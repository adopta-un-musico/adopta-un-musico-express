const express = require("express");
const Notifications = require("../models/Notifications");

const router = express.Router();

router.get("/:userId/all", async (req, res, next) => {
  const { userId } = req.params;

  try {
    const notifications = await Notifications.find({
      receiver: userId,
      visited: 0
    }).populate("sender_band");
    console.log(notifications);
    if (notifications) {
      res.render("all_notifications", { notifications });
    } else {
      const noNotification = "No hay notificaciones!";
      res.render("all_notifications", { noNotification });
    }
  } catch (error) {
    next(error);
  }
});

router.get("/:notificationId/visited", async (req, res, next) => {
  const { notificationId } = req.params;

  try {
    const notification = await Notifications.findByIdAndUpdate(notificationId, {
      visited: 1
    });
    // eslint-disable-next-line no-underscore-dangle
    res.redirect(`/notifications/${req.session.currentUser._id}/all`);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
