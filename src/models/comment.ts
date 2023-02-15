import { Schema, model, Model } from "mongoose";

import { IComment } from "interface";

const commentSchema: Schema<IComment> = new Schema<IComment>(
  {
    content: { type: String, required: true },
    date: { type: Date, default: Date.now() },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    author: { type: Schema.Types.ObjectId, ref: "User" },
    parentId: { type: Schema.Types.ObjectId, ref: "Comment" },
    postId: { type: Schema.Types.ObjectId, ref: "Post" },
  },
  { timestamps: true }
);

export const Comment: Model<IComment> = model("Comment", commentSchema);
