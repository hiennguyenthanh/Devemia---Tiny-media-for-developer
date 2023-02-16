import { validationResult } from "express-validator";
import { Post, HttpError, User } from "../models";
import { CommonError, PostError, UserError } from "../enums";

import { likeNotification, removeLikeNotification } from "./notification";
import { IPost } from "../interface";

export const getAllPosts = async (req: any, res: any, next: any) => {
  try {
    const posts: IPost[] = await Post.find().populate("author", "-password");
    res.status(200).json(posts);
  } catch (error) {
    return next(new HttpError(PostError.FAIL_TO_FETCH, 500));
  }
};

export const createPost = async (req: any, res: any, next: any) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new HttpError(CommonError.INVALID_INPUT, 400));
  }

  const author = req.userData.userId;

  let user: any;
  try {
    user = await User.findById(author);
  } catch (error) {
    return next(new HttpError(CommonError.INTERNAL_EXCEPTION, 500));
  }

  if (!user) {
    return next(new HttpError(PostError.AUTHOR_NOT_FOUND, 404));
  }

  const { title, content } = req.body;

  const newPost = new Post({
    title,
    content,
    author,
  });

  try {
    await newPost.save();
  } catch (error) {
    return next(new HttpError(PostError.FAIL_TO_CREATE, 500));
  }

  res
    .status(201)
    .json({ post: (await newPost.populate("author", "-password")).toObject() });
};

export const getPostById = async (req: any, res: any, next: any) => {
  const { postId } = req.params;

  let post;
  try {
    post = await Post.findById(postId).populate("author", "-password");
  } catch (error) {
    return next(new HttpError(CommonError.INTERNAL_EXCEPTION, 500));
  }

  if (!post) {
    return next(new HttpError(PostError.NOT_FOUND, 404));
  }

  res.status(200).json({ post });
};

export const getPostsByUserId = async (req: any, res: any, next: any) => {
  const { userId } = req.params;

  let user: any;
  try {
    user = await User.findById(userId);
  } catch (error) {
    return next(new HttpError(CommonError.INTERNAL_EXCEPTION, 500));
  }

  if (!user) {
    return next(new HttpError(UserError.NOT_FOUND, 404));
  }

  let posts;
  try {
    posts = await Post.find({ author: userId }).populate("author", "-password");
  } catch (error) {
    return next(new HttpError(PostError.FAIL_TO_FETCH, 500));
  }

  res.status(200).json({ posts });
};

export const searchPosts = async (req: any, res: any, next: any) => {
  const query = req.query.title;
  let posts;
  try {
    posts = await Post.find({
      title: { $regex: query, $options: "i" },
    });
  } catch (error) {
    return next(new HttpError(PostError.FAIL_TO_FETCH, 500));
  }

  res.status(200).json({ posts });
};

export const updatePost = async (req: any, res: any, next: any) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new HttpError(CommonError.INVALID_INPUT, 400));
  }

  const { postId } = req.params;
  let post: any;

  try {
    post = await Post.findById(postId);
  } catch (error) {
    return next(new HttpError(CommonError.INTERNAL_EXCEPTION, 500));
  }

  if (!post) {
    return next(new HttpError(PostError.NOT_FOUND, 404));
  }

  if (post.author.toString() !== req.userData.userId) {
    return next(new HttpError(CommonError.UNAUTHORIZED, 403));
  }

  Object.keys(req.body).map((key) => {
    if (req.body[key]) post[key] = req.body[key];
  });

  try {
    await post.save();
  } catch (error) {
    return next(new HttpError(PostError.FAIL_TO_UPDATE, 500));
  }

  res.status(200).json({ post });
};

export const deletePost = async (req: any, res: any, next: any) => {
  const { postId } = req.params;

  let post: any;
  try {
    post = await Post.findById(postId).populate("author");
  } catch (error) {
    return next(new HttpError(CommonError.INTERNAL_EXCEPTION, 500));
  }

  if (!post) {
    return next(new HttpError(PostError.NOT_FOUND, 404));
  }

  if (post.author._id.toString() !== req.userData.userId) {
    return next(new HttpError(CommonError.UNAUTHORIZED, 403));
  }

  try {
    await post.remove();
  } catch (error) {
    return next(new HttpError(PostError.FAIL_TO_DELETE, 500));
  }

  res.status(200).json({ message: "Deleted post!" });
};

export const likePost = async (req: any, res: any, next: any) => {
  const { postId } = req.params;

  let post: any;
  try {
    post = await Post.findById(postId);
  } catch (error) {
    return next(new HttpError(CommonError.INTERNAL_EXCEPTION, 500));
  }

  if (!post) {
    return next(new HttpError(PostError.NOT_FOUND, 404));
  }

  const author = req.userData.userId;
  try {
    post = await Post.findByIdAndUpdate(
      postId,
      { $addToSet: { likes: author } },
      { new: true }
    );

    if (post.author.toString() !== author) {
      await likeNotification(author, post.author, postId, next);
    }
  } catch (error) {
    return next(new HttpError(PostError.FAIL_TO_LIKE, 500));
  }

  res.status(200).json(post);
};

export const unlikePost = async (req: any, res: any, next: any) => {
  const { postId } = req.params;

  let post: any;
  try {
    post = await Post.findById(postId);
  } catch (error) {
    return next(new HttpError(CommonError.INTERNAL_EXCEPTION, 500));
  }

  if (!post) {
    return next(new HttpError(PostError.NOT_FOUND, 404));
  }

  const author = req.userData.userId;

  try {
    post = await Post.findByIdAndUpdate(
      postId,
      { $pull: { likes: author } },
      { new: true }
    );

    if (post.author.toString() !== author) {
      await removeLikeNotification(author, post.author, postId, next);
    }
  } catch (error) {
    return next(new HttpError(PostError.FAIL_TO_UNLIKE, 500));
  }

  res.status(200).json(post);
};
