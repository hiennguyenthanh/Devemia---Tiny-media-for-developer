const router = require("express").Router();
import { body } from "express-validator";
import {
  getAllPosts,
  createPost,
  getPostById,
  getPostsByUserId,
  searchPosts,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
} from "controllers";

import { isAuth } from "middlewares/is-auth";

router.get("/", getAllPosts);

router.get("/search?", searchPosts);

router.get("/user/:userId", getPostsByUserId);

router.get("/:postId", getPostById);

router.post(
  "/",
  [
    body("title").not().isEmpty().isLength({ min: 6 }),
    body("content").not().isEmpty().isLength({ min: 6 }),
  ],
  isAuth,
  createPost
);

router.patch("/:postId", isAuth, updatePost);

router.delete("/:postId", isAuth, deletePost);

router.put("/:postId/like", isAuth, likePost);
router.put("/:postId/unlike", isAuth, unlikePost);

export const postRoutes = router;
