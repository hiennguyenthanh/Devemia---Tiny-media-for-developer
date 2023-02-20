"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleLogin = exports.unFollowUser = exports.followUser = exports.updateUser = exports.logIn = exports.signUp = exports.getUserById = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const express_validator_1 = require("express-validator");
const google_auth_library_1 = require("google-auth-library");
require("dotenv").config();
const models_1 = require("../models");
const error_1 = require("../enums/error");
const index_1 = require("../utils/index");
const notification_1 = require("./notification");
const { SALT, GOOGLE_CLIENT_ID } = process.env;
const client = new google_auth_library_1.OAuth2Client("764856699346-tiro1ugori8or5qs2gs3vrckilamfrrs.apps.googleusercontent.com");
const DEDAULT_AVATAR = "https://res.cloudinary.com/drkvr9wta/image/upload/v1647701003/undraw_profile_pic_ic5t_ncxyyo.png";
const getUserById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    let user;
    try {
        user = yield models_1.User.findById(userId);
    }
    catch (error) {
        return next(new models_1.HttpError(error_1.CommonError.INTERNAL_EXCEPTION, 500));
    }
    if (!user) {
        return next(new models_1.HttpError(error_1.UserError.NOT_FOUND, 404));
    }
    res.status(200).json({ user });
});
exports.getUserById = getUserById;
const signUp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return next(new models_1.HttpError(error_1.CommonError.INVALID_INPUT, 400));
    }
    const { name, email, password } = req.body;
    const user = yield models_1.User.findOne({ email });
    if (user) {
        return next(new models_1.HttpError(error_1.UserError.EMAIL_USED, 400));
    }
    let hashPassword;
    try {
        hashPassword = yield bcryptjs_1.default.hash(password, parseInt(`${SALT}`));
    }
    catch (error) {
        return next(new models_1.HttpError(error_1.UserError.FAIL_TO_HASH_PASSWORD, 500));
    }
    let imageUrl;
    try {
        imageUrl = yield (0, index_1.uploadToCloudinary)(req.file);
    }
    catch (error) {
        return next(new models_1.HttpError(error_1.UserError.FAIL_TO_UPLOAD_IMAGE, 500));
    }
    try {
        const newUser = new models_1.User({
            name,
            email,
            password: hashPassword,
            avatar: imageUrl,
        });
        yield newUser.save();
        return res.status(201).json({
            user: {
                name: newUser.name,
                email: newUser.email,
                userId: newUser._id,
                avatar: newUser.avatar,
            },
        });
    }
    catch (error) {
        return next(new models_1.HttpError(error_1.UserError.FAIL_TO_CREATE, 500));
    }
});
exports.signUp = signUp;
const logIn = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield models_1.User.findOne({ email });
    if (!user) {
        return next(new models_1.HttpError(error_1.UserError.INVALID_CREDENTIALS, 422));
    }
    const isEqual = yield bcryptjs_1.default.compare(password, user.password);
    if (!isEqual) {
        return next(new models_1.HttpError(error_1.UserError.INVALID_CREDENTIALS, 422));
    }
    let token;
    try {
        token = (0, index_1.createToken)(user._id, user.password);
    }
    catch (error) {
        return next(new models_1.HttpError(error_1.UserError.FAIL_TO_GEN_TOKEN, 500));
    }
    res.status(200).json({
        user: {
            userId: user._id,
            name: user.name,
            email: user.email,
            token,
        },
    });
});
exports.logIn = logIn;
//export const googleLogin = async (req: Request, res: Response, next: NextFunction) => {
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
const updateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    let user;
    try {
        user = yield models_1.User.findById(userId);
    }
    catch (error) {
        return next(new models_1.HttpError(error_1.CommonError.INTERNAL_EXCEPTION, 500));
    }
    if (!user) {
        return next(new models_1.HttpError(error_1.UserError.NOT_FOUND, 404));
    }
    if (user._id.toString() !== req.userData.userId) {
        return next(new models_1.HttpError(error_1.CommonError.UNAUTHORIZED, 403));
    }
    if (req.file) {
        const avatar = yield (0, index_1.uploadToCloudinary)(req.file);
        req.body = Object.assign(Object.assign({}, req.body), { avatar });
    }
    Object.keys(req.body).forEach((key) => {
        user[key] = req.body[key];
    });
    try {
        yield user.save();
    }
    catch (error) {
        return next(new models_1.HttpError(error_1.CommonError.INTERNAL_EXCEPTION, 500));
    }
    res.status(200).json({
        user: {
            userId: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
        },
    });
});
exports.updateUser = updateUser;
const followUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userToFollowId } = req.body;
    const { userId } = req.userData;
    // users cannot follow themselves
    if (userToFollowId.toString() === userId.toString()) {
        return res.status(200).json({ message: "OK" });
    }
    let userToFollow;
    try {
        userToFollow = yield models_1.User.findByIdAndUpdate(userToFollowId, {
            $addToSet: { followers: userId },
        }, { new: true });
    }
    catch (error) {
        return next(new models_1.HttpError(error_1.CommonError.INTERNAL_EXCEPTION, 500));
    }
    if (!userToFollow) {
        return next(new models_1.HttpError(error_1.UserError.NOT_FOUND, 404));
    }
    try {
        yield (0, notification_1.followNotification)(userId, userToFollowId, next);
    }
    catch (error) {
        return next(new models_1.HttpError(error_1.CommonError.INTERNAL_EXCEPTION, 500));
    }
    res.status(200).json({
        user: {
            userId: userToFollow._id,
            name: userToFollow.name,
            email: userToFollow.email,
            followers: [...userToFollow.followers],
        },
    });
});
exports.followUser = followUser;
const unFollowUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userToFollowId } = req.body;
    const { userId } = req.userData;
    // users cannot un-follow themselves
    if (userToFollowId === userId) {
        return res.status(200).json({ message: "OK" });
    }
    let userToFollow;
    try {
        userToFollow = yield models_1.User.findByIdAndUpdate(userToFollowId, {
            $pull: { followers: userId },
        }, { new: true });
    }
    catch (error) {
        return next(new models_1.HttpError(error_1.CommonError.INTERNAL_EXCEPTION, 500));
    }
    if (!userToFollow) {
        return next(new models_1.HttpError(error_1.UserError.NOT_FOUND, 404));
    }
    try {
        yield (0, notification_1.removeFollowNotification)(userId, userToFollowId, next);
    }
    catch (error) {
        return next(new models_1.HttpError(error_1.CommonError.INTERNAL_EXCEPTION, 500));
    }
    res.status(200).json({
        user: {
            userId: userToFollow._id,
            name: userToFollow.name,
            email: userToFollow.email,
            followers: [...userToFollow.followers],
        },
    });
});
exports.unFollowUser = unFollowUser;
const googleLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const googleProfile = req.user;
    let user;
    try {
        user = yield models_1.User.findOne({ googleId: googleProfile.id }).exec();
    }
    catch (error) {
        throw new models_1.HttpError("Fail to find user!", 500);
    }
    if (!user) {
        let email = googleProfile.emails[0].value;
        let { name, picture, id } = googleProfile;
        let hashPassword;
        try {
            hashPassword = yield bcryptjs_1.default.hash(email + name, parseInt(`${SALT}`));
        }
        catch (error) {
            throw new models_1.HttpError(error_1.UserError.FAIL_TO_HASH_PASSWORD, 500);
        }
        user = new models_1.User({
            name: `${name.familyName} ${name.givenName}`,
            email,
            googleId: id,
            avatar: picture,
            password: hashPassword,
        });
        console.log(user);
        try {
            yield user.save();
            console.log("saved");
        }
        catch (error) {
            throw new models_1.HttpError(error_1.UserError.FAIL_TO_CREATE, 500);
        }
    }
    let token;
    try {
        token = (0, index_1.createToken)(user._id + user._id + user._id + user._id + user._id, user.email + user.email + user.email + user.email + user.email);
    }
    catch (error) {
        throw new models_1.HttpError(error_1.UserError.FAIL_TO_GEN_TOKEN, 500);
    }
    res.status(201).json({
        user: {
            userId: user._id,
            name: user.name,
            email: user.email,
            token,
        },
    });
});
exports.googleLogin = googleLogin;
