"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentError = exports.PostError = exports.UserError = exports.NotificationError = exports.CommonError = void 0;
var CommonError;
(function (CommonError) {
    CommonError["INTERNAL_EXCEPTION"] = "Internal Exception";
    CommonError["INVALID_INPUT"] = "Invalid Input!";
    CommonError["UNAUTHORIZED"] = "Unauthorized!";
})(CommonError = exports.CommonError || (exports.CommonError = {}));
var NotificationError;
(function (NotificationError) {
    NotificationError["CANNOT_CREATE_LIKE_NOTI"] = "Cannot create like notification!";
    NotificationError["CANNOT_CREATE_FOLLOW_NOTI"] = "Cannot create follow notification!";
    NotificationError["CANNOT_CREATE_COMMENT_NOTI"] = "Cannot create comment notification!";
    NotificationError["NOT_FOUND"] = "Comment not found!";
})(NotificationError = exports.NotificationError || (exports.NotificationError = {}));
var UserError;
(function (UserError) {
    UserError["EMAIL_USED"] = "This email has been registered!";
    UserError["NOT_FOUND"] = "User not found!";
    UserError["INVALID_CREDENTIALS"] = "Invalid credentials!";
    UserError["FAIL_TO_HASH_PASSWORD"] = "Fail to hash password!";
    UserError["FAIL_TO_UPLOAD_IMAGE"] = "Fail to upload image to cloudinary!";
    UserError["FAIL_TO_CREATE"] = "Fail to create user!";
    UserError["FAIL_TO_GEN_TOKEN"] = "Fail to generate token!";
    UserError["FAIL_TO_VERIFY_TOKEN"] = "Fail to generate token!";
})(UserError = exports.UserError || (exports.UserError = {}));
var PostError;
(function (PostError) {
    PostError["NOT_FOUND"] = "Post not found!";
    PostError["AUTHOR_NOT_FOUND"] = "Author not found!";
    PostError["FAIL_TO_FETCH"] = "Fail to fetch posts!";
    PostError["FAIL_TO_CREATE"] = "Fail to create post!";
    PostError["FAIL_TO_UPDATE"] = "Fail to update post!";
    PostError["FAIL_TO_DELETE"] = "Fail to delete post!";
    PostError["FAIL_TO_LIKE"] = "Fail to like post!";
    PostError["FAIL_TO_UNLIKE"] = "Fail to unlike post!";
})(PostError = exports.PostError || (exports.PostError = {}));
var CommentError;
(function (CommentError) {
    CommentError["NOT_FOUND"] = "Comment not found!";
    CommentError["FAIL_TO_FETCH"] = "Fail to fetch comments!";
    CommentError["FAIL_TO_CREATE"] = "Fail to create comment!";
    CommentError["FAIL_TO_UPDATE"] = "Fail to update comment!";
    CommentError["FAIL_TO_DELETE"] = "Fail to delete comment!";
    CommentError["FAIL_TO_LIKE"] = "Fail to like comment!";
    CommentError["FAIL_TO_UNLIKE"] = "Fail to unlike comment!";
})(CommentError = exports.CommentError || (exports.CommentError = {}));
