const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    nickname: { type: String, index: true },
    email: { type: String, required: true },
    hashedPassword: { type: String, required: true },
    musicalGenres: { type: Array, index: true },
    instruments: { type: Array, index: true },
    location: { type: String, index: true }
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
