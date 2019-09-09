const express = require('express');
const User = require('../models/User');

const router = express.Router();

/* GET users listing. */
router.get('/:userId', function(req, res, next) {
    const { userId } = req.params;

    User.findById(userId)
    .then((user)=>{
        if(user){
            console.log(user);
            res.render('profile', {user});
        }else{
            console.log("Usuario no encontrado");
        }
    })
    .catch((next));
});

module.exports = router;
