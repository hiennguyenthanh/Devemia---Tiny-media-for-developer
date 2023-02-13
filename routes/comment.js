const router = require("express").Router();
const { body } = require("express-validator");

const {
  createComment,
  deleteComment,
  getCommentsByPostId,
  updateComment,
} = require("../controllers/comment");
const isAuth = require("../middlewares/is-auth");

router.get("/:postId", getCommentsByPostId);

router.use(isAuth);

router.post("/", createComment);

router.patch("/:commentId", updateComment);

router.delete("/:commentId", deleteComment);
module.exports = router;
