const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    email: { type: String, required: true },
    hashedPassword: { type: String, required: true },
    musicalGenres: { type: Array },
    instruments: { type: Array },
    location: String,
    lat: Number,
    lgt: Number,
    nickname: { type: String },
    image: { type: String },
    // location: {type: Array, },
    loc: { type: String },

  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
);

const User = mongoose.model('User', UserSchema);

module.exports = User;
