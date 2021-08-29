const express = require("express");
const { validationResult } = require("express-validator");
const productsRepo = require("../../repositories/products");
const productsNewTemplate = require("../../views/admin/products/new");
const { requireTitle, requirePrice } = require("./validators");

//create a middle router to connect with app/router in index.js
const router = express.Router();

//router to list products to admin
router.get("/admin/products", (req, res) => {});

//router to show a form for new product
router.get("/admin/products/new", (req, res) => {
	res.send(productsNewTemplate({}));
});

router.post("/admin/products/new", [requireTitle, requirePrice], (req, res) => {
	const errors = validationResult(req);
	console.log(errors);

	res.send("submitted");
});

module.exports = router;
