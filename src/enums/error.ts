export enum CommonError {
  INTERNAL_EXCEPTION = "Internal Exception",
  INVALID_INPUT = "Invalid Input!",
  UNAUTHORIZED = "Unauthorized!",
}

export enum NotificationError {
  CANNOT_CREATE_LIKE_NOTI = "Cannot create like notification!",
  CANNOT_CREATE_FOLLOW_NOTI = "Cannot create follow notification!",
  CANNOT_CREATE_COMMENT_NOTI = "Cannot create comment notification!",
  NOT_FOUND = "Comment not found!",
}

export enum UserError {
  EMAIL_USED = "This email has been registered!",
  NOT_FOUND = "User not found!",
  INVALID_CREDENTIALS = "Invalid credentials!",
  FAIL_TO_HASH_PASSWORD = "Fail to hash password!",
  FAIL_TO_UPLOAD_IMAGE = "Fail to upload image to cloudinary!",
  FAIL_TO_CREATE = "Fail to create user!",
  FAIL_TO_GEN_TOKEN = "Fail to generate token!",
  FAIL_TO_VERIFY_TOKEN = "Fail to generate token!",
}

export enum PostError {
  NOT_FOUND = "Post not found!",
  AUTHOR_NOT_FOUND = "Author not found!",
  FAIL_TO_FETCH = "Fail to fetch posts!",
  FAIL_TO_CREATE = "Fail to create post!",
  FAIL_TO_UPDATE = "Fail to update post!",
  FAIL_TO_DELETE = "Fail to delete post!",
  FAIL_TO_LIKE = "Fail to like post!",
  FAIL_TO_UNLIKE = "Fail to unlike post!",
}

export enum CommentError {
  NOT_FOUND = "Comment not found!",
  // AUTHOR_NOT_FOUND = "Author not found!",
  FAIL_TO_FETCH = "Fail to fetch comments!",
  FAIL_TO_CREATE = "Fail to create comment!",
  FAIL_TO_UPDATE = "Fail to update comment!",
  FAIL_TO_DELETE = "Fail to delete comment!",
  FAIL_TO_LIKE = "Fail to like comment!",
  FAIL_TO_UNLIKE = "Fail to unlike comment!",
}
