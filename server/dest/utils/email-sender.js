"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mailOptions = exports.transporter = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
require("dotenv").config();
const { GOOGLE_USER, GOOGLE_PASSWORD, RECEIVER_EMAIL } = process.env;
exports.transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: GOOGLE_USER,
        pass: GOOGLE_PASSWORD,
    },
});
exports.mailOptions = {
    from: GOOGLE_USER,
    to: RECEIVER_EMAIL,
    subject: "Forget password",
    text: "...",
};
