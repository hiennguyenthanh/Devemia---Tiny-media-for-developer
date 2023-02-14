const Notification = require("../models/notification");
const NotificationType = require("../enums/noti-type");
const HttpError = require("../models/http-error");
const { NotificationError, CommonError } = require("../enums/error");

exports.likeNotification = async (senderId, postId, receiverId, next) => {
  const newNotification = new Notification({
    type: NotificationType.LIKE,
    senderId,
    receiverId,
    postId,
  });

  try {
    await newNotification.save();
    return;
  } catch (error) {
    return next(new HttpError(NotificationError.CANNOT_CREATE_LIKE_NOTI), 500);
  }
};

exports.removeLikeNotification = async (senderId, postId, receiverId, next) => {
  const notification = await Notification.findOne({
    type: NotificationType.LIKE,
    senderId,
    postId,
    receiverId,
  });

  if (!notification) {
    return next(HttpError(NotificationError.NOT_FOUND, 404));
  }

  try {
    await notification.remove();
    return;
  } catch (error) {
    return next(HttpError(CommonError.INTERNAL_EXCEPTION, 500));
  }
};

exports.commentNotification = async (
  senderId,
  receiverId,
  postId,
  commentId,
  next
) => {
  const newNotification = new Notification({
    type: NotificationType.COMMENT,
    senderId,
    receiverId,
    postId,
    commentId,
  });

  try {
    await newNotification.save();
    return;
  } catch (error) {
    return next(
      new HttpError(NotificationError.CANNOT_CREATE_COMMENT_NOTI),
      500
    );
  }
};

exports.removeCommentNotification = async (
  senderId,
  receiverId,
  postId,
  commentId,
  next
) => {
  const notification = await Notification.findOne({
    type: NotificationType.COMMENT,
    senderId,
    receiverId,
    postId,
    commentId,
  });

  if (!notification) {
    return next(HttpError(NotificationError.NOT_FOUND, 400));
  }

  try {
    await notification.remove();
    return;
  } catch (error) {
    return next(HttpError(CommonError.INTERNAL_EXCEPTION, 500));
  }
};

exports.followNotification = async (senderId, receiverId, next) => {
  const newNotification = new Notification({
    type: NotificationType.FOLLOW,
    senderId,
    receiverId,
  });

  try {
    await newNotification.save();
    return;
  } catch (error) {
    return next(
      new HttpError(NotificationError.CANNOT_CREATE_FOLLOW_NOTI),
      500
    );
  }
};

exports.removeFollowNotification = async (senderId, receiverId, next) => {
  const notification = await Notification.findOne({
    type: NotificationType.FOLLOW,
    senderId,
    receiverId,
  });

  if (!notification) {
    return next(HttpError(NotificationError.NOT_FOUND, 404));
  }

  try {
    await notification.remove();
    return;
  } catch (error) {
    return next(HttpError(CommonError.INTERNAL_EXCEPTION, 500));
  }
};
