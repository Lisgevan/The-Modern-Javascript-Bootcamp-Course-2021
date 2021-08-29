const express = require("express");
const { validationResult } = require("express-validator");
const multer = require("multer");

const productsRepo = require("../../repositories/products");
const productsNewTemplate = require("../../views/admin/products/new");
const { requireTitle, requirePrice } = require("./validators");

//create a middle router to connect with app/router in index.js
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

//router to list products to admin
router.get("/admin/products", (req, res) => {});

//router to show a form for new product
router.get("/admin/products/new", (req, res) => {
	res.send(productsNewTemplate({}));
});

router.post("/admin/products/new", upload.single("image"), [requireTitle, requirePrice], async (req, res) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.send(productsNewTemplate({ errors }));
	}

	const image = req.file.buffer.toString("base64");
	const { title, price } = req.body;
	await productsRepo.create({ title, price, image });

	res.send("submitted");
});

module.exports = router;
