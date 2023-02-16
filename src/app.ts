import express from "express";
import helmet from "helmet";
import compression from "compression";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import cookieSession from "cookie-session";
const storage = multer.memoryStorage();
const upload = multer({ storage });
require("dotenv").config();
// const passport = require("passport");
// const GoogleStrategy = require("passport-google-oauth20").Strategy;

import { userRoutes, postRoutes, commentRoutes } from "./routes";

const {
  MONGO_USER,
  MONGO_DB,
  MONGO_PASSWORD,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
} = process.env;

const app = express();

// passport.use(
//   new GoogleStrategy(s
//     {
//       clientID:
//         GOOGLE_CLIENT_ID,
//       clientSecret: GOOGLE_CLIENT_SECRET,
//       callbackURL: "/auth/google/callback",
//     },
//     (accessToken) => {
//       console.log(accessToken);
//     }
//   )
// );

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

app.use("/users", upload.single("file"), userRoutes);
app.use("/posts", upload.single("file"), postRoutes);
app.use("/comments", upload.single("file"), commentRoutes);

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
