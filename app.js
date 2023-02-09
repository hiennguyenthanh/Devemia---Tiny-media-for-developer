const express = require("express");
const helmet = require("helmet");
const compression = require("compression");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const userRoutes = require("./routes/user");

const app = express();

app.use(bodyParser.json());
app.use(helmet());
app.use(compression());

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET, POST ,PUT, DELETE",
    credentials: true,
  })
);

app.use("/users", userRoutes);

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
