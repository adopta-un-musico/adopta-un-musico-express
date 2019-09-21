const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    email: { type: String, required: true },
    hashedPassword: { type: String, required: true },
    musicalGenres: { type: Array },
    instruments: { type: Array },
    location: {
      type: {
        type: String,
      },
      coordinates: [
        Number,
      ],
    },
    nickname: { type: String },
    image: { type: String },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
);

UserSchema.index({ location: '2dsphere' });

const User = mongoose.model('User', UserSchema);

module.exports = User;
