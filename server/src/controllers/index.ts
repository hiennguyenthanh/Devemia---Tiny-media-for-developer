export * from "./comment";
export * from "./notification";
export * from "./post";
export * from "./user";

import { ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  res.send(500).json({ message: "Internal Server Error!" });
};
