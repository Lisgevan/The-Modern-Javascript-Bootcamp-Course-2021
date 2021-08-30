const express = require("express");

const { handleErrors } = require("./middlewares");
const usersRepo = require("../../repositories/users");
const signupTemplate = require("../../views/admin/auth/signup");
const signinTemplate = require("../../views/admin/auth/signin");
const {
	requireEmail,
	requirePassword,
	requirePasswordConfirmation,
	reuireEmailExists,
	requireValidPasswordForUser,
	requireEmailExists,
} = require("./validators");

//create a middle router to connect with app/router in index.js
const router = express.Router();

//route handler
router.get("/signup", (req, res) => {
	res.send(signupTemplate({ req }));
});

// // manually handle post requests (not recomended since there are libraries to do so and better)
// const bodyParser = (req, res, next) => {
// 	if (req.method === "POST") {
// 		req.on("data", data => {
// 			const parsed = data.toString("utf8").split("&");
// 			const formData = {};
// 			for (let pair of parsed) {
// 				const [key, value] = pair.split("=");
// 				formData[key] = value;
// 			}
// 			req.body = formData;
// 			next();
// 		});
// 	} else {
// 		next();
// 	}
// };
//
// router.post("/", bodyParser, (req, res) => {
// 	console.log(req.body);
// 	res.send("Account created!!!");
// });

// router.post("/", bodyParser.urlencoded({ extended:true}), (req, res) => {    (===========> deprecited)
//(new way of doing the same thing)
router.post(
	"/signup",
	[requireEmail, requirePassword, requirePasswordConfirmation],
	handleErrors(signupTemplate),
	async (req, res) => {
		const { email, password } = req.body;

		//Create a user in user repo to reprisent this person
		const user = await usersRepo.create({ email, password });

		//Store the id of that user inside the users cookie (using 3rd party library "npm install cookie-session")
		req.session.userId = user.id;

		res.redirect("/admin/products");
	}
);

router.get("/signout", (req, res) => {
	req.session = null;
	res.send("You are logged out");
});

router.get("/signin", (req, res) => {
	res.send(signinTemplate({}));
});

router.post(
	"/signin",
	[requireEmailExists, requireValidPasswordForUser],
	handleErrors(signinTemplate),
	async (req, res) => {
		const { email } = req.body;

		const user = await usersRepo.getOneBy({ email });

		req.session.userId = user.id;

		res.redirect("/admin/products");
	}
);

module.exports = router;
