import { Schema, model, Model } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

import { IUser } from "../interface";

const userSchema: Schema<IUser> = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: { type: String },
    joinDate: { type: Date, default: Date.now() },
    followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    googleId: { type: String },
  },
  { timestamps: true }
);

userSchema.plugin(uniqueValidator);

export const User: Model<IUser> = model("User", userSchema);
