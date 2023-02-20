"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const models_1 = require("../models");
require("dotenv").config();
const { JWT_SECRET } = process.env;
const isAuth = (req, res, next) => {
    try {
        const token = req.get("Authorization").split(" ")[1];
        if (!token) {
            throw new Error("Authentication failed!");
        }
        const isGoogleToken = token.length > 350;
        let decodedToken;
        if (isGoogleToken) {
            decodedToken = jsonwebtoken_1.default.decode(token); //fix
            console.log("decoded token: ", decodedToken);
            req.userData = { userId: decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.sub };
        }
        else {
            decodedToken = jsonwebtoken_1.default.verify(token, `${JWT_SECRET}`);
            req.userData = { userId: decodedToken.userId };
        }
        console.log(req.userData);
        next();
    }
    catch (error) {
        return next(new models_1.HttpError("Authentication failed!", 401));
    }
};
exports.isAuth = isAuth;
