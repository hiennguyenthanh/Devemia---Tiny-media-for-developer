"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const models_1 = require("../models");
const isAuth = (req, res, next) => {
    try {
        const token = req.get("Authorization").split(" ")[1];
        if (!token) {
            throw new Error("Authentication failed!");
        }
        const decodedToken = jsonwebtoken_1.default.verify(token, "secret");
        req.userData = { userId: decodedToken.userId };
        console.log(req.userData);
        next();
    }
    catch (error) {
        return next(new models_1.HttpError("Authentication failed!", 401));
    }
};
exports.isAuth = isAuth;
