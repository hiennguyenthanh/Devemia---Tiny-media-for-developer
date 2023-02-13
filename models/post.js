const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    likes: [{ type: mongoose.Types.ObjectId, ref: "User" }],
    author: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, default: Date.now() },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
