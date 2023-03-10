import path from "path";
import cloudinary from "../config/cloudinary";
import DatauriParser from "datauri/parser";
import jwt from "jsonwebtoken";
import { File as File_ } from "../interface";
const parser: DatauriParser = new DatauriParser();

require("dotenv").config();
const { JWT_SECRET, JWT_EXPIRE_TIME } = process.env;

export const uploadToCloudinary = async (file: any) => {
  try {
    const extName = path.extname(file.originalname).toString();
    const file64 = parser.format(extName, file.buffer);
    const uploadedResponse = await cloudinary.uploader.upload(file64.content);
    return uploadedResponse.url;
  } catch (err) {
    console.log(err);
  }
};

export const createToken = (id: string, email: string): string => {
  let token: string;
  try {
    token = jwt.sign({ userId: id, email: email }, `${JWT_SECRET}`, {
      expiresIn: JWT_EXPIRE_TIME,
    });
  } catch (err) {
    throw new Error("Fail to create token!");
  }
  return token;
};
