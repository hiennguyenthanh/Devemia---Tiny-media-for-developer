const jwt = require("jsonwebtoken");
const HttpError = require("../models/http-error");

module.exports = (req, res, next) => {
  try {
    const token = req.get("Authorization").split(" ")[1];

    if (!token) {
      throw new Error("Authentication failed!");
    }

    const decodedToken = jwt.verify(token, "secret");
    req.userData = { userId: decodedToken.userId };
    console.log(req.userData);
    next();
  } catch (error) {
    return next(new HttpError("Authentication failed!", 401));
  }
};
