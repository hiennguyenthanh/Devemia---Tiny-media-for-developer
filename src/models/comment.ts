import mongoose from "mongoose";

const Schema = mongoose.Schema;

const commentSchema = new Schema(
  {
    content: { type: String, required: true },
    date: { type: Date, default: Date.now() },
    likes: [{ type: mongoose.Types.ObjectId, ref: "User" }],
    author: { type: mongoose.Types.ObjectId, ref: "User" },
    parentId: { type: mongoose.Types.ObjectId, ref: "Comment" },
    postId: { type: mongoose.Types.ObjectId, ref: "Post" },
  },
  { timestamps: true }
);

export const Comment = mongoose.model("Comment", commentSchema);
