const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");

const User = require("../models/user");
const HttpError = require("../models/http-error");
const { CommonError, UserError } = require("../enums/error");
const { createToken } = require("../utils/index");
const { uploadToCloudinary } = require("../utils/index");

const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(
  "764856699346-tiro1ugori8or5qs2gs3vrckilamfrrs.apps.googleusercontent.com"
);

const DEDAULT_AVATAR =
  "https://res.cloudinary.com/drkvr9wta/image/upload/v1647701003/undraw_profile_pic_ic5t_ncxyyo.png";

exports.getUserById = async (req, res, next) => {
  const { userId } = req.params;

  let user;
  try {
    user = await User.findById(userId);
  } catch (error) {
    return next(new HttpError(CommonError.INTERNAL_EXCEPTION, 500));
  }

  if (!user) {
    return next(new HttpError(UserError.NOT_FOUND, 404));
  }

  res.status(200).json({ user });
};

exports.signUp = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new HttpError(CommonError.INVALID_INPUT, 400));
  }

  const { name, email, password } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    return next(new HttpError(UserError.EMAIL_USED, 400));
  }

  let hashPassword;
  try {
    hashPassword = await bcrypt.hash(password, 12);
  } catch (error) {
    return next(new HttpError(UserError.FAIL_TO_HASH_PASSWORD, 500));
  }

  let imageUrl;
  try {
    imageUrl = await uploadToCloudinary(req.file);
  } catch (error) {
    return next(new HttpError(UserError.FAIL_TO_UPLOAD_IMAGE, 500));
  }

  try {
    const newUser = new User({
      name,
      email,
      password: hashPassword,
      avatar: imageUrl,
    });

    console.log(newUser);

    await newUser.save();

    return res.status(201).json({
      user: {
        name: newUser.name,
        email: newUser.email,
        userId: newUser._id,
        avatar: newUser.avatar,
      },
    });
  } catch (error) {
    return next(new HttpError(UserError.FAIL_TO_CREATE, 500));
  }
};

exports.logIn = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return next(new HttpError(UserError.INVALID_CREDENTIALS, 422));
  }

  const isEqual = await bcrypt.compare(password, user.password);
  if (!isEqual) {
    return next(new HttpError(UserError.INVALID_CREDENTIALS, 422));
  }

  let token;
  try {
    token = createToken(user._id, user.password);
  } catch (error) {
    return next(new HttpError(UserError.FAIL_TO_GEN_TOKEN, 500));
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

exports.googleLogin = async (req, res, next) => {
  // const token = req.headers.authorization.split(" ")[1];
  const { tokenId } = req.body;
  let response;
  try {
    response = await client.verifyIdToken({
      idToken: tokenId,
      audience:
        "764856699346-tiro1ugori8or5qs2gs3vrckilamfrrs.apps.googleusercontent.com",
    });
    console.log(response);
  } catch (error) {
    return next(new HttpError(UserError.FAIL_TO_VERIFY_TOKEN, 500));
  }

  const { name, email, picture, email_verified } = response.getPayload();
  let existingUser;
  let user;

  if (email_verified) {
    // user has a google account
    try {
      existingUser = await User.findOne({ email });
    } catch (error) {
      return next(new HttpError(CommonError.INTERNAL_EXCEPTION, 500));
    }
  }

  if (!existingUser) {
    // user info not in this app db
    let hashPassword;
    try {
      hashPassword = await bcrypt.hash(email + name, 12);
    } catch (error) {
      return next(new HttpError(CommonError.INTERNAL_EXCEPTION, 500));
    }

    user = new User({
      email,
      password: hashPassword,
      name,
      avatar: picture || DEDAULT_AVATAR,
    });

    try {
      await user.save();
    } catch (error) {
      return next(new HttpError(UserError.FAIL_TO_CREATE), 500);
    }
  }

  let token;
  try {
    token = createToken(user._id, user.email);
  } catch (error) {
    return next(new HttpError(UserError.FAIL_TO_GEN_TOKEN), 500);
  }

  res.status(201).json({
    user: {
      userId: user._id,
      name: user.name,
      email: user.email,
      token,
    },
  });
};

exports.updateUser = async (req, res, next) => {
  const { userId } = req.params;

  let user;
  try {
    user = await User.findById(userId);
  } catch (error) {
    return next(new HttpError(CommonError.INTERNAL_EXCEPTION, 500));
  }

  if (!user) {
    return next(new HttpError(UserError.NOT_FOUND, 404));
  }

  if (user._id.toString() !== req.userData.userId) {
    return next(new HttpError(CommonError.UNAUTHORIZED, 403));
  }

  if (req.file) {
    const avatar = await uploadToCloudinary(req.file);
    req.body = { ...req.body, avatar };
  }

  Object.keys(req.body).forEach((key) => {
    user[key] = req.body[key];
  });

  try {
    await user.save();
  } catch (error) {
    return next(new HttpError(CommonError.INTERNAL_EXCEPTION, 500));
  }

  res.status(200).json({
    user: {
      userId: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    },
  });
};

exports.followUser = async (req, res, next) => {};
