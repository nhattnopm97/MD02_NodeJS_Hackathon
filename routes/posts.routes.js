const express = require("express");
const router = express.Router();
const fs = require("fs");
const Joi = require("joi");
const bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get("", (req, res) => {
  try {
    let posts = JSON.parse(fs.readFileSync("./user-post-api/posts.json"));
    res.json({ posts });
  } catch (error) {
    res.json({ error: error });
  }
});
router.get("/:id", (req, res) => {
  const { id } = req.params;
  try {
    let posts = JSON.parse(fs.readFileSync("./user-post-api/posts.json"));
    let postFind = posts.find((user) => user.id === +id);
    if (postFind) {
      res.json({ postFind });
    } else {
      res.json({ message: "can not find user" });
    }
  } catch (error) {
    res.json(error);
  }
});

router.post("", (req, res) => {
  const { title, body } = req.body;
  let posts = JSON.parse(fs.readFileSync("./user-post-api/posts.json"));
  let id = Math.floor(Math.random() * 10000000000);
  let newPost = {
    id,
    userId: 1,
    title,
    body,
  };
  let findTitle = posts.find((post) => post.title === title);
  if (!findTitle) {
    try {
      posts.unshift(newPost);
      fs.writeFileSync("./user-post-api/posts.json", JSON.stringify(posts));
      res.json({ success: "Add new user successfully!" });
    } catch (error) {
      res.json({ error: error });
    }
  } else {
    res.json({ message: "Title already in use!" });
  }
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { email } = req.body;
  let users = JSON.parse(fs.readFileSync("./user-post-api/posts.json"));
  let tFinded = users.findIndex((t) => t.id === +id);
  if (tFinded !== -1) {
    let updateUser = {
      ...users[tFinded],
      email: email,
    };
    users[tFinded] = updateUser;
    try {
      fs.writeFileSync("./user-post-api/posts.json", JSON.stringify(users));
      res.json({ success: "update successfully" });
    } catch (error) {
      res.json(error);
    }
  } else {
    res.json({ userNotFound: "Can't find user" });
  }
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  let users = JSON.parse(fs.readFileSync("./user-post-api/posts.json"));
  let findUsers = users.findIndex((user) => user.id === +id);
  if (findUsers !== -1) {
    try {
      users.splice(findUsers, 1);
      fs.writeFileSync("./user-post-api/posts.json", JSON.stringify(users));
      res.json({ message: "delete users successfully" });
    } catch (error) {
      res.json({ error: error });
    }
  } else {
    res.json({ message: "Can't find users" });
  }
});

module.exports = router;
