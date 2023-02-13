const express = require("express");
const helmet = require("helmet");
const compression = require("compression");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });

const userRoutes = require("./routes/user");
const postRoutes = require("./routes/post");
const commentRoutes = require("./routes/comment");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use(upload.array("files"));
app.use(helmet());
app.use(compression());

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET, POST ,PUT, DELETE",
    credentials: true,
  })
);

app.use("/users", upload.single("file"), userRoutes);
app.use("/posts", upload.single("file"), postRoutes);
app.use("/comments", upload.single("file"), commentRoutes);

try {
  mongoose.connect(
    "mongodb+srv://hien:enhLohCjm8Vk3hSP@cluster0.mwbdzpd.mongodb.net/devemia?retryWrites=true&w=majority"
  );
  app.listen(3000, () => {
    console.log("listening on port 3000");
  });
} catch (error) {
  console.log(error);
}
