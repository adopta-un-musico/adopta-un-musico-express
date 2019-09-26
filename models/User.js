const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    nickname: { type: String, index: true },
    email: { type: String, required: true },
    hashedPassword: { type: String, required: true },
<<<<<<< HEAD
    musicalGenres: { type: Array, index: true },
    instruments: { type: Array, index: true },
    location: { type: String, index: true }
=======
    musicalGenres: { type: Array },
    instruments: { type: Array },
    location: String,
    lat: Number,
    lgt: Number,
    nickname: { type: String },
    image: { type: String },
    // location: {type: Array, },
    loc: { type: String },
>>>>>>> 82eca1c55cbdb6815ba6258a6a57a4a124231535
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
