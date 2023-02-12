const router = require("express").Router();
const { body } = require("express-validator");

const { createComment } = require("../controllers/comment");

router.post("/", createComment);

module.exports = router;
