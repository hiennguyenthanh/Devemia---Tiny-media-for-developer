import { Notification, HttpError } from "models";
import { NotificationError, CommonError, NotificationType } from "enums";

import { INotification } from "interface";

export const likeNotification = async (
  senderId: any,
  receiverId: any,
  postId: any,
  next: any
) => {
  const newNotification: INotification = new Notification({
    type: NotificationType.LIKE,
    senderId,
    receiverId,
    postId,
  });

  try {
    await newNotification.save();
    return;
  } catch (error) {
    return next(new HttpError(NotificationError.CANNOT_CREATE_LIKE_NOTI, 500));
  }
};

export const removeLikeNotification = async (
  senderId: any,
  receiverId: any,
  postId: any,
  next: any
) => {
  const notification: INotification | null = await Notification.findOne({
    type: NotificationType.LIKE,
    senderId,
    postId,
    receiverId,
  });

  if (!notification) {
    return next(new HttpError(NotificationError.NOT_FOUND, 404));
  }

  try {
    await notification.remove();
    return;
  } catch (error) {
    return next(new HttpError(CommonError.INTERNAL_EXCEPTION, 500));
  }
};

export const commentNotification = async (
  senderId: any,
  receiverId: any,
  postId: any,
  commentId: any,
  next: any
) => {
  const newNotification: INotification = new Notification({
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
      new HttpError(NotificationError.CANNOT_CREATE_COMMENT_NOTI, 500)
    );
  }
};

export const removeCommentNotification = async (
  senderId: any,
  receiverId: any,
  postId: any,
  commentId: any,
  next: any
) => {
  const notification: INotification | null = await Notification.findOne({
    type: NotificationType.COMMENT,
    senderId,
    receiverId,
    postId,
    commentId,
  });

  if (!notification) {
    return next(new HttpError(NotificationError.NOT_FOUND, 400));
  }

  try {
    await notification.remove();
    return;
  } catch (error) {
    return next(new HttpError(CommonError.INTERNAL_EXCEPTION, 500));
  }
};

export const followNotification = async (
  senderId: any,
  receiverId: any,
  next: any
) => {
  const newNotification: INotification = new Notification({
    type: NotificationType.FOLLOW,
    senderId,
    receiverId,
  });

  try {
    await newNotification.save();
    return;
  } catch (error) {
    return next(
      new HttpError(NotificationError.CANNOT_CREATE_FOLLOW_NOTI, 500)
    );
  }
};

export const removeFollowNotification = async (
  senderId: any,
  receiverId: any,
  next: any
) => {
  const notification: INotification | null = await Notification.findOne({
    type: NotificationType.FOLLOW,
    senderId,
    receiverId,
  });

  if (!notification) {
    return next(new HttpError(NotificationError.NOT_FOUND, 404));
  }

  try {
    await notification.remove();
    return;
  } catch (error) {
    return next(new HttpError(CommonError.INTERNAL_EXCEPTION, 500));
  }
};
