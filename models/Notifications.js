const mongoose = require('mongoose');

const { Schema } = mongoose;

const notificationSchema = new Schema(
  {
    receiver: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    message: {
      type: String,
    },
    sender_band: {
        type: Schema.Types.ObjectId,
        ref: 'Band',
    },
    visited: { type: Number, default: 0 },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
);

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
