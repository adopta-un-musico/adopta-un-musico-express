const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    email: { type: String, required: true },
    hashedPassword: { type: String, required: true },
    musicalGenres: { type: Array, index: true },
    instruments: { type: Array, index: true },
    location: { type: String, index: true },
    nickname: { type: String},
    lat: Number,
    lgt: Number,
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
