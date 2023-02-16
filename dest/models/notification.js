"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notification = void 0;
const mongoose_1 = require("mongoose");
const notificationSchema = new mongoose_1.Schema({
    senderId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    receiverId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    postId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Post" },
    commentId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Comment" },
    date: { type: Date, default: Date.now() },
    type: {
        type: String,
        enum: ["Comment", "Follow", "Like"],
    },
    read: { type: Boolean, default: false },
});
exports.Notification = (0, mongoose_1.model)("Notification", notificationSchema);
