import { Schema, model, Model } from "mongoose";

import { INotification } from "../interface";

const notificationSchema: Schema<INotification> = new Schema<INotification>({
  senderId: { type: Schema.Types.ObjectId, ref: "User" },
  receiverId: { type: Schema.Types.ObjectId, ref: "User" },
  postId: { type: Schema.Types.ObjectId, ref: "Post" },
  commentId: { type: Schema.Types.ObjectId, ref: "Comment" },
  date: { type: Date, default: Date.now() },
  type: {
    type: String,
    enum: ["Comment", "Follow", "Like"],
  },
  read: { type: Boolean, default: false },
});

export const Notification: Model<INotification> = model(
  "Notification",
  notificationSchema
);
