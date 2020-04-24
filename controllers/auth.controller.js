const md5 = require("md5");
const db = require("../db.js");

const bcrypt = require("bcrypt");

const saltRounds = 10;

module.exports.login = (req, res) => {
  res.render("auth/login");
};

module.exports.postLogin = async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  let user = db
    .get("users")
    .find({ email: email })
    .value();

  if (!user) {
    res.render("auth/login", {
      errors: ["User does not exist."],
      values: req.body
    });

    return;
  }

  if (!user.wrongLoginCount) {
    db.get("users")
      .find({ id: user.id })
      .set("wrongLoginCount", 0)
      .write();
  }

  if (user.wrongLoginCount >= 4) {
    res.render("auth/login", {
      errors: ["Your account has been locked."],
      values: req.body
    });

    return;
  }

  if (!(await bcrypt.compare(password, user.password))) {
    db.get("users")
      .find({ id: user.id })
      .assign({ wrongLoginCount: (user.wrongLoginCount += 1) })
      .write();

    res.render("auth/login", {
      errors: ["Wrong password."],
      values: req.body
    });

    return;
  }

  res.cookie("userId", user.id, {
    signed: true
  });
  res.redirect("/users");
};
