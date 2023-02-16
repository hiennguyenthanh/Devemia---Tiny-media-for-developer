import express from "express";
const router = express.Router();
import { body } from "express-validator";

import {
  createComment,
  deleteComment,
  getCommentsByPostId,
  updateComment,
} from "../controllers";

import { isAuth } from "../middlewares/is-auth";

router.get("/:postId", getCommentsByPostId);

router.use(isAuth);

router.post("/", createComment);

router.patch("/:commentId", updateComment);

router.delete("/:commentId", deleteComment);

export const commentRoutes = router;
