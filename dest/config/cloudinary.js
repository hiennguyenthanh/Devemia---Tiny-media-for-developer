"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary = require("cloudinary").v2;
// import cloudinary from "cloudinary";
cloudinary.config({
    cloud_name: "di21gcodw",
    api_key: "789668554536589",
    api_secret: "L_mzqwVJ1dAl5GcRPim8VWbb0UM",
});
exports.default = cloudinary;
