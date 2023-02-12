const Comment = require("../models/comment");
const Post = require("../models/post");
const User = require("../models/user");
const HttpError = require("../models/http-error");

const mongoose = require("mongoose");

exports.createComment = async (req, res, next) => {
  const { content, postId, parentId } = req.body;

  let post;
  try {
    post = await Post.findById(postId);
  } catch (error) {
    return next(new HttpError("Internal exception!", 500));
  }

  if (!post) {
    return next(new HttpError("Post not found!", 404));
  }

  let user;
  try {
    user = await User.findById(req.userData.userId);
  } catch (error) {
    return next(new HttpError("Internal exception!", 500));
  }

  if (!user) {
    return next(new HttpError("User not found!", 404));
  }

  const newComment = new Comment({
    content,
    author: user._id,
    postId,
    parentId,
  });

  try {
    await newComment.save();
  } catch (error) {
    return next(new HttpError("Fail to create comment", 500));
  }

  res.status(201).json({ comment: newComment });
};

exports.deleteComment = async (req, res, next) => {
  const { commentId } = req.params;

  let comment;
  try {
    comment = await Comment.findById(commentId);
  } catch (error) {
    return next(new HttpError("Internal exception!", 500));
  }

  if (!comment) {
    return next(new HttpError("Comment not found!", 404));
  }

  try {
    await comment.remove();
  } catch (error) {
    return next(new HttpError("Fail to delete comment!", 500));
  }

  res.status(200).json({ message: "Comment deleted!" });
};
