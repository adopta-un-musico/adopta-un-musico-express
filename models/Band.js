const mongoose = require('mongoose');

const { Schema } = mongoose;

const bandSchema = new Schema(
  {
    manager: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true
    },
    bandname: String,
    musicalGenres: {
      type: Array,
      required: true
    },
    members: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
      }
    ],
    location: String
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  }
);

const Band = mongoose.model('Band', bandSchema);

module.exports = Band;
