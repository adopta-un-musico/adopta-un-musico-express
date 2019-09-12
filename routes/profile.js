const express = require("express");
const User = require("../models/User");

const router = express.Router();

/* GET users listing. */
router.get("/:userId", function(req, res, next) {
  const { userId } = req.params;

  User.findById(userId)
    .then(user => {
      if (user) {
        const isMe = req.session.currentUser._id === user._id.toString();
        console.log(isMe, req.session.currentUser._id, user._id);
        res.render("profile", { user, isMe });
      } else {
        console.log("Usuario no encontrado");
      }
    })
    .catch(next);
});
router.get("/update/:userId", function(req, res, next) {
  const { userId } = req.params;

  User.findById(userId)
    .then(user => {
      res.render("update", { user });
    })
    .catch(next);
});

router.post("/:userId", function(req, res, next) {
  const { userId } = req.params;
  const { email, nickname } = req.body;

  User.findByIdAndUpdate(userId, { email: email, nickname: nickname })
    .then(user => {
      console.log(user);
      req.flash("info", "Perfil Actualizado correctamente");
      res.redirect(`/profile/${userId}`);
    })
    .catch(next);
});
module.exports = router;
