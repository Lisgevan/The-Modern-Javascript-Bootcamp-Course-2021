const express = require("express");
const carts = require("../repositories/carts");
const cartsRepo = require("../repositories/carts");
const productsRepo = require("../repositories/products");
const cartShowTemplate = require("../views/carts/show");

const router = express.Router();

//Recieve a POST request to add an item to a chart
router.post("/cart/products", async (req, res) => {
	//Figure out if the cart exists
	let cart;
	if (!req.session.cartId) {
		//We have to make one and store card id in req.session.cartId prperty
		cart = await cartsRepo.create({ items: [] });
		req.session.cartId = cart.id;
	} else {
		//We have one, so we get it from the reository
		cart = await cartsRepo.getOne(req.session.cartId);
	}
	console.log(cart);

	const existingItem = cart.items.find(item => item.id === req.body.productId);
	if (existingItem) {
		//increment quantity and save cart
		existingItem.quantity++;
	} else {
		//add new product id to items array
		cart.items.push({ id: req.body.productId, quantity: 1 });
	}
	await cartsRepo.update(cart.id, { items: cart.items });

	// res.send(`Product added to cart ${req.session.cartId}`);
	res.redirect("/cart");
});

//Recieve a GET request to show all items in the chart
router.get("/cart", async (req, res) => {
	if (!req.session.cartId) {
		return res.redirect("/");
	}

	const cart = await carts.getOne(req.session.cartId);

	for (let item of cart.items) {
		const product = await productsRepo.getOne(item.id);
		item.product = product;
	}

	res.send(cartShowTemplate({ items: cart.items }));
});

//Recieve a POST request to delete an item from the chart
router.post("/cart/products/delete", async (req, res) => {
	const { itemId } = req.body;
	//retrieve cart frop cart repository
	const cart = await cartsRepo.getOne(req.session.cartId);
	//iterate over the items in the art and revome the item with the matching item's id
	const items = cart.items.filter(item => item.id !== itemId);
	//update carts repository
	await cartsRepo.update(req.session.cartId, { items });

	res.redirect("/cart");
});

module.exports = router;
