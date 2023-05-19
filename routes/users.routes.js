const express = require("express");
const router = express.Router();
const fs = require("fs");
const Joi = require("joi");
const bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

const checkEmail = (req, res, next) => {
  let email = req.body.email;
  let users = JSON.parse(fs.readFileSync("./user-post-api/users.json"));
  let findEmail = users.find((user) => user.email === email);
  if (!findEmail) next();
  else {
    res.json({ message: "email already exits" });
  }
};

const validate = (req, res, next) => {
  console.log(req.body);
  let { name, username, email } = req.body;
  let validateSchema = Joi.object({
    name: Joi.string().alphanum().min(4).max(30).required(),
    username: Joi.string().alphanum().min(4).max(30).required(),
    email: Joi.string().email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    }),
    // password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
  });
  let validateResult = validateSchema.validate({ name, username, email });
  if (!validateResult.error) next();
  else res.json({ message: validateResult.error.details[0].message });
};
const validateEmail = (req, res, next) => {
  let email = req.body.email;
  let validateSchema = Joi.object({
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
      })
      .min(10),
    // password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
  });
  let validateResult = validateSchema.validate({ email });
  if (!validateResult.error) next();
  else res.json({ message: validateResult.error.details[0].message });
};

router.get("", (req, res) => {
  try {
    let users = JSON.parse(fs.readFileSync("./user-post-api/users.json"));
    res.json({ users });
  } catch (error) {
    res.json({ error: error });
  }
});
router.get("/:id", (req, res) => {
  const { id } = req.params;
  try {
    let users = JSON.parse(fs.readFileSync("./user-post-api/users.json"));
    let userFind = users.find((user) => user.id === +id);
    if (userFind) {
      res.json({ userFind });
    } else {
      res.json({ message: "can not find user" });
    }
  } catch (error) {
    res.json(error);
  }
});

router.post("", validate, checkEmail, (req, res) => {
  const { name, username, email } = req.body;
  let users = JSON.parse(fs.readFileSync("./user-post-api/users.json"));
  let id = Math.floor(Math.random() * 10000000000);
  let newUser = {
    id,
    name,
    username,
    email,
  };
  console.log(newUser);
  users.unshift(newUser);
  try {
    fs.writeFileSync("./user-post-api/users.json", JSON.stringify(users));
    res.json({ success: "Add new user successfully!" });
  } catch (error) {
    res.json({ error: error });
  }
});

router.put("/:id", validateEmail, checkEmail, (req, res) => {
  const { id } = req.params;
  const { email } = req.body;
  let users = JSON.parse(fs.readFileSync("./user-post-api/users.json"));
  let tFinded = users.findIndex((t) => t.id === +id);
  if (tFinded !== -1) {
    let updateUser = {
      ...users[tFinded],
      email: email,
    };
    users[tFinded] = updateUser;
    try {
      fs.writeFileSync("./user-post-api/users.json", JSON.stringify(users));
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
  let users = JSON.parse(fs.readFileSync("./user-post-api/users.json"));
  let findUsers = users.findIndex((user) => user.id === +id);
  if (findUsers !== -1) {
    try {
      users.splice(findUsers, 1);
      fs.writeFileSync("./user-post-api/users.json", JSON.stringify(users));
      res.json({ message: "delete users successfully" });
    } catch (error) {
      res.json({ error: error });
    }
  } else {
    res.json({ message: "Can't find users" });
  }
});

module.exports = router;
