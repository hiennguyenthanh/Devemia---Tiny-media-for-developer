const router = require("express").Router();
const { body } = require("express-validator");
const {
  getAllPosts,
  createPost,
  getPostById,
  getPostsByUserId,
  searchPosts,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
} = require("../controllers/post");
const isAuth = require("../middlewares/is-auth");

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

module.exports = router;
