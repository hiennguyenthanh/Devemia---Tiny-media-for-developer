import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";
import { OAuth2Client } from "google-auth-library";
require("dotenv").config();

import { HttpError, User } from "../models";
import { CommonError, UserError } from "../enums/error";
import { createToken, uploadToCloudinary } from "../utils/index";

import { followNotification, removeFollowNotification } from "./notification";
const { SALT, GOOGLE_CLIENT_ID } = process.env;

const client: OAuth2Client = new OAuth2Client(
  "764856699346-tiro1ugori8or5qs2gs3vrckilamfrrs.apps.googleusercontent.com"
);

const DEDAULT_AVATAR: string =
  "https://res.cloudinary.com/drkvr9wta/image/upload/v1647701003/undraw_profile_pic_ic5t_ncxyyo.png";

export const getUserById = async (req: any, res: any, next: any) => {
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

export const signUp = async (req: any, res: any, next: any) => {
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
    hashPassword = await bcrypt.hash(password, parseInt(`${SALT}`));
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

export const logIn = async (req: any, res: any, next: any) => {
  const { email, password } = req.body;

  const user: any = await User.findOne({ email });

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

//export const googleLogin = async (req: any, res: any, next: any) => {
// console.log(req.user.accessToken);
// let response: any;
// try {
//   response = await client.verifyIdToken({
//     idToken: req.user.accessToken,
//     audience: GOOGLE_CLIENT_ID,
//   });
//   console.log(response);
// } catch (error) {
//   return next(new HttpError(UserError.FAIL_TO_VERIFY_TOKEN, 500));
// }

// const { name, email, picture, email_verified } = response.getPayload();
// let existingUser;
// let user: any;

// if (email_verified) {
//   // user has a google account
//   try {
//     existingUser = await User.findOne({ email });
//   } catch (error) {
//     return next(new HttpError(CommonError.INTERNAL_EXCEPTION, 500));
//   }
// }

// if (!existingUser) {
//   // user info not in this app db
//   let hashPassword;
//   try {
//     hashPassword = await bcrypt.hash(email + name, parseInt(`${SALT}`));
//   } catch (error) {
//     return next(new HttpError(CommonError.INTERNAL_EXCEPTION, 500));
//   }

//   user = new User({
//     email,
//     password: hashPassword,
//     name,
//     avatar: picture || DEDAULT_AVATAR,
//   });

//   try {
//     await user.save();
//   } catch (error) {
//     return next(new HttpError(UserError.FAIL_TO_CREATE, 500));
//   }
// }

// let token;
// try {
//   token = createToken(user._id, user.email);
// } catch (error) {
//   return next(new HttpError(UserError.FAIL_TO_GEN_TOKEN, 500));
// }

// res.status(201).json({
//   user: {
//     userId: user._id,
//     name: user.name,
//     email: user.email,
//     token,
//   },
// });
//};

export const updateUser = async (req: any, res: any, next: any) => {
  const { userId } = req.params;

  let user: any;
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

export const followUser = async (req: any, res: any, next: any) => {
  const { userToFollowId } = req.body;
  const { userId } = req.userData;

  // users cannot follow themselves

  if (userToFollowId.toString() === userId.toString()) {
    return res.status(200).json({ message: "OK" });
  }

  let userToFollow;

  try {
    userToFollow = await User.findByIdAndUpdate(
      userToFollowId,
      {
        $addToSet: { followers: userId },
      },
      { new: true }
    );
  } catch (error) {
    return next(new HttpError(CommonError.INTERNAL_EXCEPTION, 500));
  }

  if (!userToFollow) {
    return next(new HttpError(UserError.NOT_FOUND, 404));
  }

  try {
    await followNotification(userId, userToFollowId, next);
  } catch (error) {
    return next(new HttpError(CommonError.INTERNAL_EXCEPTION, 500));
  }

  res.status(200).json({
    user: {
      userId: userToFollow._id,
      name: userToFollow.name,
      email: userToFollow.email,
      followers: [...userToFollow.followers],
    },
  });
};

export const unFollowUser = async (req: any, res: any, next: any) => {
  const { userToFollowId } = req.body;
  const { userId } = req.userData;

  // users cannot un-follow themselves
  if (userToFollowId === userId) {
    return res.status(200).json({ message: "OK" });
  }

  let userToFollow;

  try {
    userToFollow = await User.findByIdAndUpdate(
      userToFollowId,
      {
        $pull: { followers: userId },
      },
      { new: true }
    );
  } catch (error) {
    return next(new HttpError(CommonError.INTERNAL_EXCEPTION, 500));
  }

  if (!userToFollow) {
    return next(new HttpError(UserError.NOT_FOUND, 404));
  }

  try {
    await removeFollowNotification(userId, userToFollowId, next);
  } catch (error) {
    return next(new HttpError(CommonError.INTERNAL_EXCEPTION, 500));
  }

  res.status(200).json({
    user: {
      userId: userToFollow._id,
      name: userToFollow.name,
      email: userToFollow.email,
      followers: [...userToFollow.followers],
    },
  });
};

export const googleLogin = async (req: any, res: any, next: any) => {
  const googleProfile = req.user;

  let user: any;
  try {
    user = await User.findOne({ googleId: googleProfile.id }).exec();
  } catch (error) {
    throw new HttpError("Fail to find user!", 500);
  }

  if (!user) {
    let email: string = googleProfile.emails[0].value;
    let { name, picture, id } = googleProfile;
    let hashPassword;

    try {
      hashPassword = await bcrypt.hash(email + name, parseInt(`${SALT}`));
    } catch (error) {
      throw new HttpError(UserError.FAIL_TO_HASH_PASSWORD, 500);
    }

    user = new User({
      name: `${name.familyName} ${name.givenName}`,
      email,
      googleId: id,
      avatar: picture,
      password: hashPassword,
    });

    console.log(user);

    try {
      await user.save();
      console.log("saved");
    } catch (error) {
      throw new HttpError(UserError.FAIL_TO_CREATE, 500);
    }
  }

  let token;
  try {
    token = createToken(
      user._id + user._id + user._id + user._id + user._id,
      user.email + user.email + user.email + user.email + user.email
    );
  } catch (error) {
    throw new HttpError(UserError.FAIL_TO_GEN_TOKEN, 500);
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
