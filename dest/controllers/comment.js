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
exports.deleteComment = exports.updateComment = exports.getCommentsByPostId = exports.createComment = void 0;
const models_1 = require("../models");
const enums_1 = require("../enums");
const notification_1 = require("./notification");
const createComment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { content, postId, parentId } = req.body;
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
    let user;
    try {
        user = yield models_1.User.findById(req.userData.userId);
    }
    catch (error) {
        return next(new models_1.HttpError(enums_1.CommonError.INTERNAL_EXCEPTION, 500));
    }
    if (!user) {
        return next(new models_1.HttpError(enums_1.UserError.NOT_FOUND, 404));
    }
    const newComment = new models_1.Comment({
        content,
        author: user._id,
        postId,
        parentId,
    });
    try {
        yield newComment.save();
        if (newComment.author.toString() !== post.author.toString()) {
            yield (0, notification_1.commentNotification)(newComment.author, post.author, postId, newComment._id, next);
        }
    }
    catch (error) {
        return next(new models_1.HttpError(enums_1.CommentError.FAIL_TO_CREATE, 500));
    }
    res.status(201).json({ comment: newComment });
});
exports.createComment = createComment;
const getCommentsByPostId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
    let comments;
    try {
        comments = yield models_1.Comment.find({ postId });
    }
    catch (error) {
        return next(new models_1.HttpError(enums_1.CommonError.INTERNAL_EXCEPTION, 500));
    }
    res.status(200).json({ comments });
});
exports.getCommentsByPostId = getCommentsByPostId;
const updateComment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { commentId } = req.params;
    let comment;
    try {
        comment = yield models_1.Comment.findById(commentId);
    }
    catch (error) {
        return next(new models_1.HttpError(enums_1.CommonError.INTERNAL_EXCEPTION, 500));
    }
    if (!comment) {
        return next(new models_1.HttpError(enums_1.CommentError.NOT_FOUND, 404));
    }
    Object.keys(req.body).forEach((key) => {
        comment[key] = req.body[key];
    });
    try {
        yield comment.save();
    }
    catch (error) {
        return next(new models_1.HttpError(enums_1.CommentError.FAIL_TO_UPDATE, 500));
    }
    res.status(200).json(comment);
});
exports.updateComment = updateComment;
const deleteComment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { commentId } = req.params;
    let comment;
    try {
        comment = yield models_1.Comment.findById(commentId).populate("postId");
    }
    catch (error) {
        return next(new models_1.HttpError(enums_1.CommonError.INTERNAL_EXCEPTION, 500));
    }
    if (!comment) {
        return next(new models_1.HttpError(enums_1.CommentError.NOT_FOUND, 404));
    }
    try {
        yield comment.remove();
        if (comment.author.toString() !== comment.postId.toString()) {
            yield (0, notification_1.removeCommentNotification)(comment.author, comment.postId.author, comment.postId._id, comment._id, next);
        }
    }
    catch (error) {
        return next(new models_1.HttpError(enums_1.CommentError.FAIL_TO_DELETE, 500));
    }
    res.status(200).json({ message: "Comment deleted!" });
});
exports.deleteComment = deleteComment;
