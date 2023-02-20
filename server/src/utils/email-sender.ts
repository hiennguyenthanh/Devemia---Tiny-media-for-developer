import nodemailer from "nodemailer";
require("dotenv").config();
const { GOOGLE_EMAIL, GOOGLE_APP_PASSWORD, RECEIVER_EMAIL } = process.env;

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: GOOGLE_EMAIL,
    pass: GOOGLE_APP_PASSWORD,
  },
});

export const mailOptions = {
  from: GOOGLE_EMAIL,
  to: RECEIVER_EMAIL,
  subject: "Forget password",
  text: "Click here to change password",
};
