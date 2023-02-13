const mongoose = require("mongoose");
const { NotificationType } = require("../enums/noti-type");

const Schema = mongoose.Schema;

const notificationSchema = new Schema({
  senderId: { type: Schema.Types.ObjectId, ref: "User" },
  receiverId: { type: Schema.Types.ObjectId, ref: "User" },
  postId: { type: Schema.Types.ObjectId, ref: "Post" },
  commentId: { type: Schema.Types.ObjectId, ref: "Comment" },
  date: { type: Date, default: Date.now() },
  types: {
    type: String,
    enum: NotificationType,
  },
  read: { type: Boolean, default: false },
});

module.exports = mongoose.model("Notification", notificationSchema);
