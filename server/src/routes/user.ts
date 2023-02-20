import express from "express";
const router = express.Router();
import { body } from "express-validator";
import passport from "passport";
import {
  getUserById,
  signUp,
  logIn,
  googleLogin,
  updateUser,
  followUser,
  unFollowUser,
  sendForgetPasswordEmail,
  changePassword,
} from "../controllers";

import { isAuth } from "../middlewares/is-auth";

router.get("/forgetPassword", sendForgetPasswordEmail);

router.post(
  "/signup",
  [
    body("name").not().isEmpty(),
    body("email").not().isEmpty(),
    body("password").isLength({ min: 6 }),
  ],
  signUp
);

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  googleLogin
);

router.get("/:userId", getUserById);

router.post("/login", logIn);

router.post("/changePassword", [body("email").not().isEmpty()], changePassword);

router.use(isAuth);

router.post("/follow", followUser);

router.post("/unfollow", unFollowUser);

router.patch("/:userId", updateUser);

export const userRoutes = router;
