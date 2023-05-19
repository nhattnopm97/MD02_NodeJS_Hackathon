//b1: Khởi tạo app
const express = require("express");
const app = express();
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const Joi = require("joi");
const bodyParser = require("body-parser");
// Import routes
const usersRoutes = require("./routes/users.routes");
const postsRoutes = require("./routes/posts.routes");

// Use routes

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/api/v1/users", usersRoutes);

app.use("/api/v1/posts", postsRoutes);

app.get("/*", (req, res) => {
  res.json({
    message: "Not found",
  });
});

//Cài đặt cho app luôn luôn chờ đợi và lắng nghe và chờ đợi các request gửi lên từ client
app.listen(3000, () => {
  console.log("app listening on  http://localhostport:3000");
});
