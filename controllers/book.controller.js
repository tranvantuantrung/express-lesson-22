const cloudinary = require("cloudinary").v2;
const shortid = require("shortid");

const db = require("../db.js");

cloudinary.config({
  cloud_name: process.env.CLOUND_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

module.exports.index = (req, res) => {
  res.render("books/index", {
    books: db.get("books").value()
  });
};

module.exports.create = (req, res) => {
  req.body.id = shortid.generate();

  db.get("books")
    .push(req.body)
    .write();
  res.redirect("back");
};

module.exports.idUpdate = (req, res) => {
  let id = req.params.id;

  res.render("books/update-cover", {
    id: id
  });
};

module.exports.update = async (req, res) => {
  let book = db
    .get("books")
    .find({ id: req.body.id })
    .value();

  let file = await cloudinary.uploader.upload(req.file.path);

  if (!book.coverUrl) {
    db.get("books")
      .find({ id: req.body.id })
      .set("coverUrl", file.url)
      .write();
  } else {
    db.get("books")
      .find({ id: req.body.id })
      .assign({ coverUrl: file.url })
      .write();
  }

  res.redirect("/books");
};

module.exports.delete = (req, res) => {
  let id = req.params.id;

  db.get("books")
    .remove({ id: id })
    .write();

  res.redirect("back");
};
