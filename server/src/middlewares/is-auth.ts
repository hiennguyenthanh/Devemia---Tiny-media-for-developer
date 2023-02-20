import jwt from "jsonwebtoken";
import { HttpError } from "../models";
import { RequestHandler } from "express";
require("dotenv").config();
const { JWT_SECRET } = process.env;

export const isAuth: RequestHandler = (req: any, res: any, next: any) => {
  try {
    const token = req.get("Authorization").split(" ")[1];

    if (!token) {
      throw new Error("Authentication failed!");
    }

    const isGoogleToken: boolean = token.length > 350;

    let decodedToken: any;
    if (isGoogleToken) {
      decodedToken = jwt.decode(token); //fix
      console.log("decoded token: ", decodedToken);

      req.userData = { userId: decodedToken?.sub };
    } else {
      decodedToken = jwt.verify(token, `${JWT_SECRET}`);

      req.userData = { userId: decodedToken.userId };
    }

    console.log(req.userData);
    next();
  } catch (error) {
    return next(new HttpError("Authentication failed!", 401));
  }
};
