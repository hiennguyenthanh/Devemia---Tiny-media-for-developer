import jwt from "jsonwebtoken";
import { HttpError } from "models";

export const isAuth = (req: any, res: any, next: any) => {
  try {
    const token = req.get("Authorization").split(" ")[1];

    if (!token) {
      throw new Error("Authentication failed!");
    }

    const decodedToken: any = jwt.verify(token, "secret");

    req.userData = { userId: decodedToken.userId };

    console.log(req.userData);
    next();
  } catch (error) {
    return next(new HttpError("Authentication failed!", 401));
  }
};
