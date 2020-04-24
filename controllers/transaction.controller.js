const shortid = require("shortid");

const db = require("../db.js");

module.exports.index = (req, res) => {
  let page = req.query.page ? parseInt(req.query.page) : 1;

  let perPage = 3;

  let begin = (page - 1) * perPage;
  let end = begin + perPage;

  let books = db.get("books").value();
  let users = db.get("users").value();
  let transactions = db.get("transactions").value();

  if (res.locals.user.isAdmin === "true") {
    let changeTrans = transactions.map(trans => {
      let book = books.find(book => book.id === trans.bookId);
      let user = users.find(user => user.id === trans.userId);

      return {
        bookTitle: book.title,
        userName: user.name,
        id: trans.id,
        isComplete: trans.isComplete
      };
    });

    res.render("transactions/index", {
      transactions: changeTrans.slice(begin, end),
      page,
      lengthPage: Math.ceil(changeTrans.length / perPage),
      books,
      users
    });

    return;
  }

  let memberTrans = transactions.filter(trans => {
    return trans.userId === res.locals.user.id;
  });

  let changeTrans = memberTrans.map(trans => {
    let book = books.find(book => book.id === trans.bookId);

    return {
      bookTitle: book.title,
      userName: res.locals.user.name,
      id: trans.id,
      isComplete: trans.isComplete
    };
  });

  res.render("transactions/index", {
    transactions: changeTrans.slice(begin, end),
    page,
    lengthPage: Math.ceil(changeTrans.length / perPage),
    books,
    users: [res.locals.user]
  });
};

module.exports.create = (req, res) => {
  let session = db
    .get("session")
    .find({ id: req.signedCookies.sessionId })
    .value();

  if (session) {
    for (let book in session.cart) {
      for (let i = 0; i < session.cart[book]; i++) {
        db.get("transactions")
          .push({
            id: shortid.generate(),
            bookId: book,
            userId: req.signedCookies.userId
          })
          .write();
      }
    }
    db.get("session")
      .find({ id: req.signedCookies.sessionId })
      .assign({ cart: {} })
      .write();

    res.redirect("/transactions");
    return;
  } else {
    req.body.id = shortid.generate();

    db.get("transactions")
      .push(req.body)
      .write();
  }

  res.redirect("back");
};

module.exports.complete = (req, res) => {
  let id = req.params.id;

  db.get("transactions")
    .find({ id: id })
    .set("isComplete", true)
    .write();

  res.redirect("back");
};
