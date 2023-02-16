"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const controllers_1 = require("../controllers");
const is_auth_1 = require("../middlewares/is-auth");
router.get("/:postId", controllers_1.getCommentsByPostId);
router.use(is_auth_1.isAuth);
router.post("/", controllers_1.createComment);
router.patch("/:commentId", controllers_1.updateComment);
router.delete("/:commentId", controllers_1.deleteComment);
exports.commentRoutes = router;
