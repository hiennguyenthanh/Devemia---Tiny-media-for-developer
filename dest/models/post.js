"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
const mongoose_1 = require("mongoose");
const postSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    likes: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "User" }],
    author: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, default: Date.now() },
}, { timestamps: true });
exports.Post = (0, mongoose_1.model)("Post", postSchema);
