"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFollowNotification = exports.followNotification = exports.removeCommentNotification = exports.commentNotification = exports.removeLikeNotification = exports.likeNotification = void 0;
const models_1 = require("../models");
const enums_1 = require("../enums");
const likeNotification = (senderId, receiverId, postId, next) => __awaiter(void 0, void 0, void 0, function* () {
    const newNotification = new models_1.Notification({
        type: enums_1.NotificationType.LIKE,
        senderId,
        receiverId,
        postId,
    });
    try {
        yield newNotification.save();
        return;
    }
    catch (error) {
        return next(new models_1.HttpError(enums_1.NotificationError.CANNOT_CREATE_LIKE_NOTI, 500));
    }
});
exports.likeNotification = likeNotification;
const removeLikeNotification = (senderId, receiverId, postId, next) => __awaiter(void 0, void 0, void 0, function* () {
    const notification = yield models_1.Notification.findOne({
        type: enums_1.NotificationType.LIKE,
        senderId,
        postId,
        receiverId,
    });
    if (!notification) {
        return next(new models_1.HttpError(enums_1.NotificationError.NOT_FOUND, 404));
    }
    try {
        yield notification.remove();
        return;
    }
    catch (error) {
        return next(new models_1.HttpError(enums_1.CommonError.INTERNAL_EXCEPTION, 500));
    }
});
exports.removeLikeNotification = removeLikeNotification;
const commentNotification = (senderId, receiverId, postId, commentId, next) => __awaiter(void 0, void 0, void 0, function* () {
    const newNotification = new models_1.Notification({
        type: enums_1.NotificationType.COMMENT,
        senderId,
        receiverId,
        postId,
        commentId,
    });
    try {
        yield newNotification.save();
        return;
    }
    catch (error) {
        return next(new models_1.HttpError(enums_1.NotificationError.CANNOT_CREATE_COMMENT_NOTI, 500));
    }
});
exports.commentNotification = commentNotification;
const removeCommentNotification = (senderId, receiverId, postId, commentId, next) => __awaiter(void 0, void 0, void 0, function* () {
    const notification = yield models_1.Notification.findOne({
        type: enums_1.NotificationType.COMMENT,
        senderId,
        receiverId,
        postId,
        commentId,
    });
    if (!notification) {
        return next(new models_1.HttpError(enums_1.NotificationError.NOT_FOUND, 400));
    }
    try {
        yield notification.remove();
        return;
    }
    catch (error) {
        return next(new models_1.HttpError(enums_1.CommonError.INTERNAL_EXCEPTION, 500));
    }
});
exports.removeCommentNotification = removeCommentNotification;
const followNotification = (senderId, receiverId, next) => __awaiter(void 0, void 0, void 0, function* () {
    const newNotification = new models_1.Notification({
        type: enums_1.NotificationType.FOLLOW,
        senderId,
        receiverId,
    });
    try {
        yield newNotification.save();
        return;
    }
    catch (error) {
        return next(new models_1.HttpError(enums_1.NotificationError.CANNOT_CREATE_FOLLOW_NOTI, 500));
    }
});
exports.followNotification = followNotification;
const removeFollowNotification = (senderId, receiverId, next) => __awaiter(void 0, void 0, void 0, function* () {
    const notification = yield models_1.Notification.findOne({
        type: enums_1.NotificationType.FOLLOW,
        senderId,
        receiverId,
    });
    if (!notification) {
        return next(new models_1.HttpError(enums_1.NotificationError.NOT_FOUND, 404));
    }
    try {
        yield notification.remove();
        return;
    }
    catch (error) {
        return next(new models_1.HttpError(enums_1.CommonError.INTERNAL_EXCEPTION, 500));
    }
});
exports.removeFollowNotification = removeFollowNotification;
