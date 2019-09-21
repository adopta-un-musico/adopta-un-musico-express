const mongoose = require('mongoose');

const { Schema } = mongoose;

const eventsSchema = new Schema(
  {
    event_manager:{
      type: Schema.Types.ObjectId,
      ref: 'Band',
    },
    event_name: String,
    location: String,
    lat: Number,
    lgt: Number,
    recomendations: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    date: Date,
    asistentes: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
  },

  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
);

const Events = mongoose.model('Events', eventsSchema);

module.exports = Events;
