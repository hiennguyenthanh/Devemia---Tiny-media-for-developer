import { Schema, model, Model } from "mongoose";

import { IPost } from "../interface";

const postSchema: Schema<IPost> = new Schema<IPost>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, default: Date.now() },
  },
  { timestamps: true }
);

export const Post: Model<IPost> = model("Post", postSchema);
