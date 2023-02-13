const router = require("express").Router();
const { body } = require("express-validator");

const {
  getUserById,
  signUp,
  logIn,
  googleLogin,
} = require("../controllers/user");

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

router.post("/login", logIn);
router.post("/auth/google", googleLogin);

module.exports = router;
