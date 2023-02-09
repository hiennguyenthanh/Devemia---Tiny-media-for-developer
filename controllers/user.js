const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");

const User = require("../models/user");
const HttpError = require("../models/http-error");

exports.getUserById = async (req, res, next) => {
  const { userId } = req.params;

  const user = await User.findById(userId, "-password");

  if (!user) {
    return next(new HttpError("User not found!", 404));
  }

  res.status(200).json({ user });
};

exports.signUp = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid inputs!", 422));
  }

  const { name, email, password } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    return next(new HttpError("Email used! Try login instead!", 422));
  }

  try {
    const hashPassword = await bcrypt.hash(password, 12);

    const newUser = new User({ name, email, password: hashPassword });

    await newUser.save();

    res.status(201).json({
      user: {
        name: newUser.name,
        email: newUser.email,
        userId: newUser._id,
      },
    });
  } catch (error) {
    return next(new HttpError("Internal Exception!", 500));
  }
};
