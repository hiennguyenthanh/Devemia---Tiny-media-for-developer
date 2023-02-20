import express from "express";
import helmet from "helmet";
import compression from "compression";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import cookieSession from "cookie-session";

import { Server } from "socket.io";
import { createServer } from "http";

import passport from "passport";
const GoogleStrategy = require("passport-google-oauth20").Strategy;

import { userRoutes, postRoutes, commentRoutes } from "./routes";
import { errorHandler } from "./controllers";

const storage = multer.memoryStorage();
const upload = multer({ storage });

require("dotenv").config();
const {
  MONGO_USER,
  MONGO_DB,
  MONGO_PASSWORD,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
} = process.env;

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use(upload.array("files"));
app.use(helmet());
app.use(compression());

app.use(
  cookieSession({
    name: "session",
    keys: ["cookie_key"],
    maxAge: 24 * 60 * 60 * 1000,
    secure: false,
    sameSite: false,
  })
);

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET, POST ,PUT, DELETE",
    credentials: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user: any, done) {
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "/users/auth/google/callback", // --> controller
    },
    async (accessToken: any, refreshToken: any, profile: any, done: any) => {
      profile.accessToken = accessToken;
      done(null, profile);
    }
  )
);

const HttpServer = createServer(app);

const io: Server = new Server(HttpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
// socketHandlers(io);

app.use("/users", upload.single("file"), userRoutes);
app.use("/posts", upload.single("file"), postRoutes);
app.use("/comments", upload.single("file"), commentRoutes);

app.use(errorHandler);

try {
  mongoose.connect(
    `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@cluster0.mwbdzpd.mongodb.net/${MONGO_DB}?retryWrites=true&w=majority`
  );
  app.listen(3000, () => {
    console.log("listening on port 3000");
  });
} catch (error) {
  console.log(error);
}
