const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");

const User = require("../models/user");
const HttpError = require("../models/http-error");
const { createtoken } = require("../utils/index");
const { uploadToCloudinary } = require("../utils/index");

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
    return next(new HttpError("Invalid inputs!", 400));
  }

  const { name, email, password } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    return next(new HttpError("Email used! Try login instead!", 422));
  }

  let hashPassword;
  try {
    hashPassword = await bcrypt.hash(password, 12);
  } catch (error) {
    return next(new HttpError("Fail to hash password!", 500));
  }
  let imageUrl;
  // try {
  //   imageUrl = await uploadToCloudinary(req.file);
  // } catch (error) {
  //   return next(new HttpError("Fail to upload image to cloud!", 500));
  // }

  try {
    const newUser = new User({
      name,
      email,
      password: hashPassword,
      avatar: imageUrl,
    });

    await newUser.save();

    res.status(201).json({
      user: {
        name: newUser.name,
        email: newUser.email,
        userId: newUser._id,
        avatar: newUser.avatar,
      },
    });
  } catch (error) {}
};

exports.logIn = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return next(new HttpError("Invalid credetials!", 422));
  }

  const isEqual = await bcrypt.compare(password, user.password);
  if (!isEqual) {
    return next(new HttpError("Invalid credetials!", 422));
  }

  let token;
  try {
    token = createtoken(user._id, user.password);
  } catch (error) {
    return next(new HttpError("Failed to generate token!", 500));
  }

  res.status(200).json({
    user: {
      userId: user._id,
      name: user.name,
      email: user.email,
      token,
    },
  });
};

exports.updateUser = async (req, res, next) => {};
