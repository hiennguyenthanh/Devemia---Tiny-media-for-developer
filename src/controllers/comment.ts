import { Comment, Post, User, HttpError } from "models";

import { CommonError, CommentError, PostError, UserError } from "enums";

import {
  commentNotification,
  removeCommentNotification,
} from "controllers/notification";

export const createComment = async (req: any, res: any, next: any) => {
  const { content, postId, parentId } = req.body;

  let post;
  try {
    post = await Post.findById(postId);
  } catch (error) {
    return next(new HttpError(CommonError.INTERNAL_EXCEPTION, 500));
  }

  if (!post) {
    return next(new HttpError(PostError.NOT_FOUND, 404));
  }

  let user;
  try {
    user = await User.findById(req.userData.userId);
  } catch (error) {
    return next(new HttpError(CommonError.INTERNAL_EXCEPTION, 500));
  }

  if (!user) {
    return next(new HttpError(UserError.NOT_FOUND, 404));
  }

  const newComment: any = new Comment({
    content,
    author: user._id,
    postId,
    parentId,
  });

  try {
    await newComment.save();

    if (newComment.author.toString() !== post.author.toString()) {
      await commentNotification(
        newComment.author,
        post.author,
        postId,
        newComment._id,
        next
      );
    }
  } catch (error) {
    return next(new HttpError(CommentError.FAIL_TO_CREATE, 500));
  }

  res.status(201).json({ comment: newComment });
};

export const getCommentsByPostId = async (req: any, res: any, next: any) => {
  const { postId } = req.params;

  let post;
  try {
    post = await Post.findById(postId);
  } catch (error) {
    return next(new HttpError(CommonError.INTERNAL_EXCEPTION, 500));
  }

  if (!post) {
    return next(new HttpError(PostError.NOT_FOUND, 404));
  }

  let comments;
  try {
    comments = await Comment.find({ postId });
  } catch (error) {
    return next(new HttpError(CommonError.INTERNAL_EXCEPTION, 500));
  }

  res.status(200).json({ comments });
};

export const updateComment = async (req: any, res: any, next: any) => {
  const { commentId } = req.params;

  let comment: any;
  try {
    comment = await Comment.findById(commentId);
  } catch (error) {
    return next(new HttpError(CommonError.INTERNAL_EXCEPTION, 500));
  }

  if (!comment) {
    return next(new HttpError(CommentError.NOT_FOUND, 404));
  }

  Object.keys(req.body).forEach((key) => {
    comment[key] = req.body[key];
  });

  try {
    await comment.save();
  } catch (error) {
    return next(new HttpError(CommentError.FAIL_TO_UPDATE, 500));
  }

  res.status(200).json(comment);
};

export const deleteComment = async (req: any, res: any, next: any) => {
  const { commentId } = req.params;

  let comment: any;
  try {
    comment = await Comment.findById(commentId).populate("postId");
  } catch (error) {
    return next(new HttpError(CommonError.INTERNAL_EXCEPTION, 500));
  }

  if (!comment) {
    return next(new HttpError(CommentError.NOT_FOUND, 404));
  }

  try {
    await comment.remove();

    if (comment.author.toString() !== comment.postId.toString()) {
      await removeCommentNotification(
        comment.author,
        comment.postId.author,
        comment.postId._id,
        comment._id,
        next
      );
    }
  } catch (error) {
    return next(new HttpError(CommentError.FAIL_TO_DELETE, 500));
  }

  res.status(200).json({ message: "Comment deleted!" });
};
