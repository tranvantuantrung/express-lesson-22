const db = require("../db.js");

module.exports.requiredAuth = (req, res, next) => {
  if (!req.signedCookies.userId) {
    res.redirect("/auth/login");
    return;
  }

  let user = db
    .get("users")
    .find({ id: req.signedCookies.userId })
    .value();

  if (!user) {
    res.redirect("/auth/login");
    return;
  }

  next();
};
