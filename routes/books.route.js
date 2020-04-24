const express = require("express");
const multer = require("multer");

const upload = multer({ dest: "uploads/" });

const controller = require("../controllers/book.controller.js");

const router = express.Router();

router.get("/", controller.index);

router.post("/", controller.create);

router.get("/:id/update", controller.idUpdate);

router.post("/update",upload.single("coverUrl"), controller.update);

router.get("/:id/delete", controller.delete);

module.exports = router;
