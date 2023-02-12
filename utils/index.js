const path = require("path");
const cloudinary = require("../config/cloudinary");
const DatauriParser = require("datauri/parser");
const parser = new DatauriParser();
const jwt = require("jsonwebtoken");

exports.uploadToCloudinary = async (file) => {
  try {
    console.log(file);
    const extName = path.extname(file.originalname).toString();
    const file64 = parser.format(extName, file.buffer);
    const uploadedResponse = await cloudinary.uploader.upload(file64.content);
    return uploadedResponse.url;
  } catch (err) {
    console.log(err);
  }
};

exports.createtoken = (id, email) => {
  let token;
  try {
    token = jwt.sign({ userId: id, email: email }, "secret", {
      expiresIn: "6h",
    });
  } catch (err) {
    throw new Error("Fail to create token!");
  }
  return token;
};
