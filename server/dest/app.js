"use strict";
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
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
require("dotenv").config();
// const passport = require("passport");
// const GoogleStrategy = require("passport-google-oauth20").Strategy;
const routes_1 = require("./routes");
const { MONGO_USER, MONGO_DB, MONGO_PASSWORD } = process.env;
const app = (0, express_1.default)();
// passport.use(
//   new GoogleStrategy(s
//     {
//       clientID:
//         "764856699346-tiro1ugori8or5qs2gs3vrckilamfrrs.apps.googleusercontent.com",
//       clientSecret: "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",
//       callbackURL: "/auth/google/callback",
//     },
//     (accessToken) => {
//       console.log(accessToken);
//     }
//   )
// );
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
app.use("/users", upload.single("file"), routes_1.userRoutes);
app.use("/posts", upload.single("file"), routes_1.postRoutes);
app.use("/comments", upload.single("file"), routes_1.commentRoutes);
try {
    mongoose_1.default.connect(`mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@cluster0.mwbdzpd.mongodb.net/${MONGO_DB}?retryWrites=true&w=majority`);
    app.listen(3000, () => {
        console.log(MONGO_USER);
        console.log("listening on port 3000");
    });
}
catch (error) {
    console.log(error);
}
