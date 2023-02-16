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
exports.unlikePost = exports.likePost = exports.deletePost = exports.updatePost = exports.searchPosts = exports.getPostsByUserId = exports.getPostById = exports.createPost = exports.getAllPosts = void 0;
const express_validator_1 = require("express-validator");
const models_1 = require("../models");
const enums_1 = require("../enums");
const notification_1 = require("./notification");
const getAllPosts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield models_1.Post.find().populate("author", "-password");
        res.status(200).json(posts);
    }
    catch (error) {
        return next(new models_1.HttpError(enums_1.PostError.FAIL_TO_FETCH, 500));
    }
});
exports.getAllPosts = getAllPosts;
const createPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return next(new models_1.HttpError(enums_1.CommonError.INVALID_INPUT, 400));
    }
    const author = req.userData.userId;
    let user;
    try {
        user = yield models_1.User.findById(author);
    }
    catch (error) {
        return next(new models_1.HttpError(enums_1.CommonError.INTERNAL_EXCEPTION, 500));
    }
    if (!user) {
        return next(new models_1.HttpError(enums_1.PostError.AUTHOR_NOT_FOUND, 404));
    }
    const { title, content } = req.body;
    const newPost = new models_1.Post({
        title,
        content,
        author,
    });
    try {
        yield newPost.save();
    }
    catch (error) {
        return next(new models_1.HttpError(enums_1.PostError.FAIL_TO_CREATE, 500));
    }
    res
        .status(201)
        .json({ post: (yield newPost.populate("author", "-password")).toObject() });
});
exports.createPost = createPost;
const getPostById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId } = req.params;
    let post;
    try {
        post = yield models_1.Post.findById(postId).populate("author", "-password");
    }
    catch (error) {
        return next(new models_1.HttpError(enums_1.CommonError.INTERNAL_EXCEPTION, 500));
    }
    if (!post) {
        return next(new models_1.HttpError(enums_1.PostError.NOT_FOUND, 404));
    }
    res.status(200).json({ post });
});
exports.getPostById = getPostById;
const getPostsByUserId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    let posts;
    try {
        posts = yield models_1.Post.find({ author: userId }).populate("author", "-password");
    }
    catch (error) {
        return next(new models_1.HttpError(enums_1.PostError.FAIL_TO_FETCH, 500));
    }
    res.status(200).json({ posts });
});
exports.getPostsByUserId = getPostsByUserId;
const searchPosts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query.title;
    let posts;
    try {
        posts = yield models_1.Post.find({
            title: { $regex: query, $options: "i" },
        });
    }
    catch (error) {
        return next(new models_1.HttpError(enums_1.PostError.FAIL_TO_FETCH, 500));
    }
    res.status(200).json({ posts });
});
exports.searchPosts = searchPosts;
const updatePost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return next(new models_1.HttpError(enums_1.CommonError.INVALID_INPUT, 400));
    }
    const { postId } = req.params;
    let post;
    try {
        post = yield models_1.Post.findById(postId);
    }
    catch (error) {
        return next(new models_1.HttpError(enums_1.CommonError.INTERNAL_EXCEPTION, 500));
    }
    if (!post) {
        return next(new models_1.HttpError(enums_1.PostError.NOT_FOUND, 404));
    }
    if (post.author.toString() !== req.userData.userId) {
        return next(new models_1.HttpError(enums_1.CommonError.UNAUTHORIZED, 403));
    }
    Object.keys(req.body).map((key) => {
        if (req.body[key])
            post[key] = req.body[key];
    });
    try {
        yield post.save();
    }
    catch (error) {
        return next(new models_1.HttpError(enums_1.PostError.FAIL_TO_UPDATE, 500));
    }
    res.status(200).json({ post });
});
exports.updatePost = updatePost;
const deletePost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId } = req.params;
    let post;
    try {
        post = yield models_1.Post.findById(postId).populate("author");
    }
    catch (error) {
        return next(new models_1.HttpError(enums_1.CommonError.INTERNAL_EXCEPTION, 500));
    }
    if (!post) {
        return next(new models_1.HttpError(enums_1.PostError.NOT_FOUND, 404));
    }
    if (post.author._id.toString() !== req.userData.userId) {
        return next(new models_1.HttpError(enums_1.CommonError.UNAUTHORIZED, 403));
    }
    try {
        yield post.remove();
    }
    catch (error) {
        return next(new models_1.HttpError(enums_1.PostError.FAIL_TO_DELETE, 500));
    }
    res.status(200).json({ message: "Deleted post!" });
});
exports.deletePost = deletePost;
const likePost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId } = req.params;
    let post;
    try {
        post = yield models_1.Post.findById(postId);
    }
    catch (error) {
        return next(new models_1.HttpError(enums_1.CommonError.INTERNAL_EXCEPTION, 500));
    }
    if (!post) {
        return next(new models_1.HttpError(enums_1.PostError.NOT_FOUND, 404));
    }
    const author = req.userData.userId;
    try {
        post = yield models_1.Post.findByIdAndUpdate(postId, { $addToSet: { likes: author } }, { new: true });
        if (post.author.toString() !== author) {
            yield (0, notification_1.likeNotification)(author, post.author, postId, next);
        }
    }
    catch (error) {
        return next(new models_1.HttpError(enums_1.PostError.FAIL_TO_LIKE, 500));
    }
    res.status(200).json(post);
});
exports.likePost = likePost;
const unlikePost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId } = req.params;
    let post;
    try {
        post = yield models_1.Post.findById(postId);
    }
    catch (error) {
        return next(new models_1.HttpError(enums_1.CommonError.INTERNAL_EXCEPTION, 500));
    }
    if (!post) {
        return next(new models_1.HttpError(enums_1.PostError.NOT_FOUND, 404));
    }
    const author = req.userData.userId;
    try {
        post = yield models_1.Post.findByIdAndUpdate(postId, { $pull: { likes: author } }, { new: true });
        if (post.author.toString() !== author) {
            yield (0, notification_1.removeLikeNotification)(author, post.author, postId, next);
        }
    }
    catch (error) {
        return next(new models_1.HttpError(enums_1.PostError.FAIL_TO_UNLIKE, 500));
    }
    res.status(200).json(post);
});
exports.unlikePost = unlikePost;
