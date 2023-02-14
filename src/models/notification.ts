import mongoose from "mongoose";
// import { NotificationType } from "enums/noti-type";

const Schema = mongoose.Schema;

const notificationSchema = new Schema({
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

export const Notification = mongoose.model("Notification", notificationSchema);
