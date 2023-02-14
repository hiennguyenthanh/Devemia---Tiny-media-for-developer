const router = require("express").Router();
const { body } = require("express-validator");

const passport = require("passport");

const {
  getUserById,
  signUp,
  logIn,
  googleLogin,
  updateUser,
  followUser,
  unFollowUser,
} = require("../controllers/user");

const isAuth = require("../middlewares/is-auth");

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

module.exports = router;
