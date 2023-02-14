import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const Schema = mongoose.Schema;

const userSchema = new Schema(
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
    // following: [{ type: mongoose.Types.ObjectId, ref: "User" }],
    followers: [{ type: mongoose.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

userSchema.plugin(uniqueValidator);

export const User = mongoose.model("User", userSchema);
