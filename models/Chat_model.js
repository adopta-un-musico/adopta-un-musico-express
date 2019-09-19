const mongoose = require("mongoose");

const { Schema } = mongoose;

const chatSchema = new Schema(
  {
    username: String,
    message: String,
    room: String,
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
