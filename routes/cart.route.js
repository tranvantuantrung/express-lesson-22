const express = require("express");

const controller = require("../controllers/cart.controller.js");

const router = express.Router();

router.get("/add/:bookId", controller.addToCart);

module.exports = router;
