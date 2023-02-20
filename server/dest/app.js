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
const socket_io_1 = require("socket.io");
const http_1 = require("http");
const passport_1 = __importDefault(require("passport"));
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const routes_1 = require("./routes");
const controllers_1 = require("./controllers");
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
require("dotenv").config();
const { MONGO_USER, MONGO_DB, MONGO_PASSWORD, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, } = process.env;
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
    profile.accessToken = accessToken;
    done(null, profile);
})));
const HttpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(HttpServer, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});
// socketHandlers(io);
app.use("/users", upload.single("file"), routes_1.userRoutes);
app.use("/posts", upload.single("file"), routes_1.postRoutes);
app.use("/comments", upload.single("file"), routes_1.commentRoutes);
app.use(controllers_1.errorHandler);
try {
    mongoose_1.default.connect(`mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@cluster0.mwbdzpd.mongodb.net/${MONGO_DB}?retryWrites=true&w=majority`);
    app.listen(3000, () => {
        console.log("listening on port 3000");
    });
}
catch (error) {
    console.log(error);
}
