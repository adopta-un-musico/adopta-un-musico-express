const mongoose = require("mongoose");

const { Schema } = mongoose;

const bandSchema = new Schema(
  {
    manager: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    bandname: String,
    musicalGenres: {
      type: Array
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    petitions:[
      {
        type: Schema.Types.ObjectId,
        ref: "User"
      }
  ],
    location: String
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);

const Band = mongoose.model("Band", bandSchema);

module.exports = Band;
