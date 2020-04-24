const db = require("../db.js");

module.exports.addToCart = (req, res) => {
  let bookId = req.params.bookId;
  let sessionId = req.signedCookies.sessionId;

  if (!sessionId) {
    res.redirect("/books");
  }

  let count = db
    .get("session")
    .find({ id: sessionId })
    .get("cart." + bookId, 0)
    .value();

  db.get("session")
    .find({ id: sessionId })
    .set("cart." + bookId, count + 1)
    .write();

  res.redirect("/books");
};
