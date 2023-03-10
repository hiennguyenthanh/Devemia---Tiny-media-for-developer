"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const express_validator_1 = require("express-validator");
const passport_1 = __importDefault(require("passport"));
const controllers_1 = require("../controllers");
const is_auth_1 = require("../middlewares/is-auth");
router.get("/:userId", controllers_1.getUserById);
router.post("/signup", [
    (0, express_validator_1.body)("name").not().isEmpty(),
    (0, express_validator_1.body)("email").not().isEmpty(),
    (0, express_validator_1.body)("password").isLength({ min: 6 }),
], controllers_1.signUp);
router.get("/auth/google", passport_1.default.authenticate("google", { scope: ["profile", "email"] }));
router.get("/auth/google/callback", passport_1.default.authenticate("google", { failureRedirect: "/login" }), controllers_1.googleLogin);
router.get("/forgetPassword", controllers_1.sendForgetPasswordEmail);
router.post("/login", controllers_1.logIn);
router.use(is_auth_1.isAuth);
router.post("/follow", controllers_1.followUser);
router.post("/unfollow", controllers_1.unFollowUser);
router.patch("/:userId", controllers_1.updateUser);
exports.userRoutes = router;
