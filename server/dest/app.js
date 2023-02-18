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
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const body_parser_1 = __importDefault(require("body-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const multer_1 = __importDefault(require("multer"));
const cookie_session_1 = __importDefault(require("cookie-session"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
const passport_1 = __importDefault(require("passport"));
require("dotenv").config();
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const routes_1 = require("./routes");
const models_1 = require("./models");
const { MONGO_USER, MONGO_DB, MONGO_PASSWORD, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, SALT, } = process.env;
const app = (0, express_1.default)();
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
// app.use(upload.array("files"));
app.use((0, helmet_1.default)());
app.use((0, compression_1.default)());
app.use((0, cookie_session_1.default)({
    name: "session",
    keys: ["cookie_key"],
    maxAge: 24 * 60 * 60 * 1000,
    secure: false,
    sameSite: false,
}));
app.use((0, cors_1.default)({
    origin: "http://localhost:3000",
    methods: "GET, POST ,PUT, DELETE",
    credentials: true,
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
passport_1.default.serializeUser(function (user, done) {
    done(null, user);
});
passport_1.default.deserializeUser(function (user, done) {
    done(null, user);
});
passport_1.default.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "/users/auth/google/callback", // --> controller
}, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    let user;
    try {
        user = yield models_1.User.findOne({ googleId: profile.id }).exec();
    }
    catch (error) {
        throw new models_1.HttpError("Fail to find user!", 500);
    }
    console.log("user", user);
    if (user === null) {
        let email = profile.emails[0].value;
        let { name, picture, id } = profile;
        let hashPassword;
        try {
            hashPassword = yield bcryptjs_1.default.hash(email + name, parseInt(`${SALT}`));
        }
        catch (error) {
            throw new models_1.HttpError("Fail to hash", 500);
        }
        user = new models_1.User({
            name,
            email,
            googleId: id,
            avatar: picture,
            password: hashPassword,
        });
        try {
            yield user.save();
        }
        catch (error) {
            throw new models_1.HttpError("Internal exception", 500);
        }
    }
    else {
        done(null, profile);
    }
})));
app.use("/users", upload.single("file"), routes_1.userRoutes);
app.use("/posts", upload.single("file"), routes_1.postRoutes);
app.use("/comments", upload.single("file"), routes_1.commentRoutes);
try {
    mongoose_1.default.connect(`mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@cluster0.mwbdzpd.mongodb.net/${MONGO_DB}?retryWrites=true&w=majority`);
    app.listen(3000, () => {
        console.log("listening on port 3000");
    });
}
catch (error) {
    console.log(error);
}
