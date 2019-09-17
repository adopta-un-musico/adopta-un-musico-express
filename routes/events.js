const express = require("express");
const Events = require("../models/Events");
const User = require("../models/User");

const router = express.Router();

router.get("/all", async (req, res, next) => {


    try {
        const events = await Events.find().populate("event_manager")
        console.log(events);
        res.render('all_events', { events });
    } catch (error) {
        next(error);
        
    }
});

router.get("/detail/:eventId", async (req, res, next) => {
    const  { eventId } = req.params;

    try {
        const event = await Events.find({_id: eventId }).populate("event_manager");
        const eventToView = event[0];
        const totalRecommend = eventToView.recomendations;
        const result = totalRecommend.length;
        const isMe = req.session.currentUser._id === eventToView.event_manager.manager.toString();

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
        res.render('event_detail', { eventToView, isMe, ifRecommended, ifuserWillAssist, result })
    } catch (error) {

        next(error);
    }
});

router.get('/new/:bandId', async (req, res, next) =>{
    const { bandId } = req.params;
    console.log(bandId);
    res.render('add_event', { bandId });
});

router.post('/:bandId/add', async (req, res, next) =>{
    const { bandId } = req.params;
    const { name, date, location } = req.body;
    try {
        const event = await Events.create({
            event_manager: bandId,
            event_name: name,
            location: location,
            date: date,
        })
        req.flash("info", "Evento creado correctamente");
        res.redirect(`/bandas/profile/${bandId}`);
        
    } catch (error) {

        next(error);
    }
});
router.get('/delete/:eventId', async (req, res, next) =>{
    
    const {eventId} = req.params;

    try {
        const deletEvent = await Events.findByIdAndDelete(eventId);
        req.flash("info", "Evento eliminado correctamente");
        res.redirect(`/bandas/all`);
        
    } catch (error) {
        next(error);
    }
});

router.get('/recommend/:eventId',  async (req, res, next) =>{

    const { eventId } = req.params;
    try {
        const event = await Events.findByIdAndUpdate(eventId, {
            $push: {recomendations: req.session.currentUser._id }
          });
          res.redirect(`/events/detail/${eventId}`);
    } catch (error) {
        next(error);
        
    }
});
router.get('/join/:eventId', async (req, res, next) =>{

    const { eventId } = req.params; 
    try {
        const event = await Events.findByIdAndUpdate(eventId, {
            $push: {asistentes: req.session.currentUser._id }
          });
          res.redirect(`/events/detail/${eventId}`);
    } catch (error) {

        next(error);
    }

});
router.get('/leave/:eventId', async (req, res, next) =>{

    const { eventId } = req.params; 
    try {
        const event = await Events.findByIdAndUpdate(eventId, {
            $pull: {asistentes: req.session.currentUser._id }
          });
          res.redirect(`/events/detail/${eventId}`);
    } catch (error) {

        next(error);
    }

});
router.get('/norecommend/:eventId',  async (req, res, next) =>{

    const { eventId } = req.params;
    try {
        const event = await Events.findByIdAndUpdate(eventId, {
            $pull: {recomendations: req.session.currentUser._id }
          });
          res.redirect(`/events/detail/${eventId}`);
    } catch (error) {
        next(error);
        
    }
});

router.get('/update/:eventId', async (req, res, next) =>{
    const { eventId } = req.params;
    try {
        const event = await Events.findById(eventId)
        res.render('update_event', { event });
    } catch (error) {
        next(error);
    }

});

router.post('/:eventId/upd', async (req, res, next) =>{
    
    const { eventId } = req.params;
    const { name, date, location } = req.body;

    try {
        const event = await Events.findByIdAndUpdate(eventId, {
            event_name: name,
            location: location,
            date: date,
        })
        req.flash("info", "Evento creado correctamente");
        res.redirect(`/events/detail/${event._id}`);
    } catch (error) {
        next(error);
    }
 
});
router.get('/:userId/recommendations',  async (req, res, next) => {

    const { userId } = req.params;

    try {
        const recommendations = await Events.find( { recomendations: userId } ).populate("event_manager")
        res.render('my_recommendations', { recommendations });

    } catch (error) {
      next(error);
    }
});

router.get('/:userId/event', async (req, res, next) =>{

    const { userId } = req.params;

    try {
        const iWillAssist = await Events.find({asistentes: userId}).populate("event_manager")
        const username = await User.findById(userId)
        console.log(iWillAssist);
        res.render('events', { iWillAssist, username })

    } catch (error) {
        next(error);
    }
})


module.exports = router;