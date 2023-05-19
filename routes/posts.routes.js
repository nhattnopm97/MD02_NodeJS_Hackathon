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
  let findBody = posts.find((post) => post.body === body);
  if (!findTitle && !findBody) {
    try {
      posts.unshift(newPost);
      fs.writeFileSync("./user-post-api/posts.json", JSON.stringify(posts));
      res.json({ success: "Add new user successfully!" });
    } catch (error) {
      res.json({ error: error });
    }
  } else {
    res.json({ message: "Title or content already in use!" });
  }
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { title, body } = req.body;
  let posts = JSON.parse(fs.readFileSync("./user-post-api/posts.json"));
  let tFinded = posts.findIndex((t) => t.id === +id);
  if (tFinded !== -1) {
    let updatePost = {
      ...posts[tFinded],
      title,
      body,
    };
    posts[tFinded] = updatePost;
    try {
      fs.writeFileSync("./user-post-api/posts.json", JSON.stringify(posts));
      res.json({ success: "update post successfully" });
    } catch (error) {
      res.json(error);
    }
  } else {
    res.json({ userNotFound: "Can't find user" });
  }
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  let posts = JSON.parse(fs.readFileSync("./user-post-api/posts.json"));
  let findpost = posts.findIndex((user) => user.id === +id);
  if (findpost !== -1) {
    try {
      posts.splice(findpost, 1);
      fs.writeFileSync("./user-post-api/posts.json", JSON.stringify(posts));
      res.json({ message: "delete post successfully" });
    } catch (error) {
      res.json({ error: error });
    }
  } else {
    res.json({ message: "Can't find post" });
  }
});

module.exports = router;
