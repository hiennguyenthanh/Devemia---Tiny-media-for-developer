"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postRoutes = void 0;
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const express_validator_1 = require("express-validator");
const controllers_1 = require("../controllers");
const is_auth_1 = require("../middlewares/is-auth");
router.get("/", controllers_1.getAllPosts);
router.get("/search?", controllers_1.searchPosts);
router.get("/user/:userId", controllers_1.getPostsByUserId);
router.get("/:postId", controllers_1.getPostById);
router.post("/", [
    (0, express_validator_1.body)("title").not().isEmpty().isLength({ min: 6 }),
    (0, express_validator_1.body)("content").not().isEmpty().isLength({ min: 6 }),
], is_auth_1.isAuth, controllers_1.createPost);
router.patch("/:postId", is_auth_1.isAuth, controllers_1.updatePost);
router.delete("/:postId", is_auth_1.isAuth, controllers_1.deletePost);
router.put("/:postId/like", is_auth_1.isAuth, controllers_1.likePost);
router.put("/:postId/unlike", is_auth_1.isAuth, controllers_1.unlikePost);
exports.postRoutes = router;
