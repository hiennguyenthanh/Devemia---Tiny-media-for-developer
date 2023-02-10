const Post = require("../models/post");
const User = require("../models/user");
const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

exports.getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.find().populate("author");

    res.status(200).json(posts);
  } catch (error) {
    return next(new HttpError("Failed to fetch posts!", 500));
  }
};

exports.createPost = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid inputs!", 400));
  }

  const author = req.userData.userId;

  let user;
  try {
    user = await User.findById(author);
  } catch (error) {
    return next(new HttpError("Internal exception!", 500));
  }

  if (!user) {
    return next(new HttpError("Author not found!", 404));
  }

  const { title, content } = req.body;

  const newPost = new Post({
    title,
    content,
    author,
  });

  try {
    const session = await mongoose.startSession();
    session.startTransaction();

    await newPost.save({ session });

    user.posts.push(newPost);

    await user.save({ session });

    await session.commitTransaction();
  } catch (error) {
    return next(new HttpError("Fail to create post", 500));
  }

  res
    .status(201)
    .json({ post: (await newPost.populate("author", "-password")).toObject() });
};

//issue: populate comments
exports.getPostById = async (req, res, next) => {
  const { postId } = req.params;

  let post;
  try {
    post = await Post.findById(postId).populate("author", "-password");
  } catch (error) {
    return next(new HttpError("Internal exception!", 500));
  }

  if (!post) {
    return next(new HttpError("Post not found!", 404));
  }

  res.status(200).json({ post });
};

exports.getPostsByUserId = async (req, res, next) => {
  const { userId } = req.params;
  let posts;
  try {
    posts = await Post.find({ author: userId }).populate("author", "-password");
  } catch (error) {
    return next(new HttpError("Fail to fetch posts!", 500));
  }

  res.status(200).json({ posts });
};

exports.searchPosts = async (req, res, next) => {
  const query = req.query.title;
  let posts;
  try {
    posts = await Post.find({
      title: { $regex: query, $options: "i" },
    });
  } catch (error) {
    return next(new HttpError("Fail to search posts!", 500));
  }

  res.status(200).json({ posts });
};

exports.updatePost = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid inputs!", 400));
  }

  const { postId } = req.params;
  let post;

  try {
    post = await Post.findById(postId);
  } catch (error) {
    return next(new HttpError("Internal exception!", 500));
  }

  if (!post) {
    return next(new HttpError("Post not found!", 404));
  }

  if (post.author.toString() !== req.userData.userId) {
    return next(new HttpError("Unauthorized!", 403));
  }

  Object.keys(req.body).map((key) => {
    if (req.body[key]) post[key] = req.body[key];
  });

  try {
    await post.save();
  } catch (error) {
    return next(new HttpError("Cannot update post!", 500));
  }

  res.status(200).json({ post });
};

exports.deletePost = async (req, res, next) => {
  const { postId } = req.params;

  let post;
  try {
    post = await Post.findById(postId).populate("author");
  } catch (error) {
    return next(new HttpError("Internal exception!", 500));
  }

  if (!post) {
    return next(new HttpError("Post not found!", 404));
  }

  if (post.author._id.toString() !== req.userData.userId) {
    return next(new HttpError("Unauthorized!", 403));
  }

  try {
    const session = await mongoose.startSession();
    session.startTransaction();

    await post.remove({ session });
    post.author.posts.pull(post);
    await post.author.save({ session });

    await session.commitTransaction();
  } catch (error) {
    return next(new HttpError("Fail to delete post!", 500));
  }

  res.status(200).json({ message: "Deleted post!" });
};

exports.likePost = async (req, res, next) => {
  const { postId } = req.params;

  let post;
  try {
    post = await Post.findById(postId);
  } catch (error) {
    return next(new HttpError("Internal exception!", 500));
  }

  if (!post) {
    return next(new HttpError("Post not found!", 404));
  }

  const author = req.userData.userId;
  try {
    post = await Post.findByIdAndUpdate(
      postId,
      { $addToSet: { likes: author } },
      { new: true }
    );

    if (post.author.toString() !== author) {
      // handle notification
    }
  } catch (error) {
    return next(new HttpError("Fail to like post!", 500));
  }

  res.status(200).json(post);
};

exports.unlikePost = async (req, res, next) => {
  const { postId } = req.params;

  let post;
  try {
    post = await Post.findById(postId);
  } catch (error) {
    return next(new HttpError("Internal exception!", 500));
  }

  if (!post) {
    return next(new HttpError("Post not found!", 404));
  }

  const author = req.userData.userId;
  try {
    post = await Post.findByIdAndUpdate(
      postId,
      { $pull: { likes: author } },
      { new: true }
    );

    if (post.author.toString() !== author) {
      // handle notification
    }
  } catch (error) {
    return next(new HttpError("Fail to unlike post!", 500));
  }

  res.status(200).json(post);
};
