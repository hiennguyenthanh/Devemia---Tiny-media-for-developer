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
} from "../controllers";

import { isAuth } from "../middlewares/is-auth";

router.get("/:userId", getUserById);

router.post(
  "/signup",
  [
    body("name").not().isEmpty(),
    body("email").not().isEmpty(),
    body("password").isLength({ min: 6 }),
  ],
  signUp
);

// router.get(
//   "/auth/google",
//   passport.authenticate("google", { scope: ["profile", "email"] })
// );

// router.get("/auth/google/callback", passport.authenticate("google"));

router.post("/login", logIn);

router.post("/auth/google", googleLogin);

router.use(isAuth);

router.post("/follow", followUser);

router.post("/unfollow", unFollowUser);

router.patch("/:userId", updateUser);

export const userRoutes = router;
