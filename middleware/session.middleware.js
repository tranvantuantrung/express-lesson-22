const shortid = require("shortid");
const db = require("../db.js");

module.exports = (req, res, next) => {
  let sessionId = shortid.generate();

  if (req.signedCookies.userId) {
    let user = db
      .get("users")
      .find({ id: req.signedCookies.userId })
      .value();
    if (user) {
      res.locals.user = user;
    }
  }

  if (!req.signedCookies.sessionId) {
    res.cookie("sessionId", sessionId, {
      signed: true
    });

    db.get("session")
      .push({ id: sessionId })
      .write();
  }

  let session = db
    .get("session")
    .find({ id: req.signedCookies.sessionId })
    .value();

  let count = 0;

  if (session) {
    for (let book in session.cart) {
      count += session.cart[book];
    }
  }

  res.locals.count = count;

  next();
};
