"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createToken = exports.uploadToCloudinary = void 0;
const path_1 = __importDefault(require("path"));
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const parser_1 = __importDefault(require("datauri/parser"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const parser = new parser_1.default();
const uploadToCloudinary = (file) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const extName = path_1.default.extname(file.originalname).toString();
        const file64 = parser.format(extName, file.buffer);
        const uploadedResponse = yield cloudinary_1.default.uploader.upload(file64.content);
        return uploadedResponse.url;
    }
    catch (err) {
        console.log(err);
    }
});
exports.uploadToCloudinary = uploadToCloudinary;
const createToken = (id, email) => {
    let token;
    try {
        token = jsonwebtoken_1.default.sign({ userId: id, email: email }, "secret", {
            expiresIn: "6h",
        });
    }
    catch (err) {
        throw new Error("Fail to create token!");
    }
    return token;
};
exports.createToken = createToken;
