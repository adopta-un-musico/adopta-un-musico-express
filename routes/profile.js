const express = require('express');
const User = require('../models/User');

const router = express.Router();

/* GET users listing. */
router.get('/:userId', function(req, res, next) {
    const { userId } = req.params;

    User.findById(userId)
    .then((user)=>{
        if(user){
            res.render('profile', {user});
        }else{
            console.log("Usuario no encontrado");
        }
    })
    .catch((next));
});
router.get('/update/:userId', function(req, res, next) {
    const { userId } = req.params;

    User.findById(userId)
    .then((user)=>{
        res.render('update', {user});
    })
    .catch(next);
});

router.post('/:userId', function(req, res, next) {
    const { userId } = req.params;
    const { email }  = req.body;

    User.findByIdAndUpdate(userId, { email: email })
    .then((user) =>{
        console.log(user);
        req.flash('info', 'Perfil Actualizado correctamente');
        res.redirect(`/profile/${userId}`);
    })
    .catch(next);
});
module.exports = router;
