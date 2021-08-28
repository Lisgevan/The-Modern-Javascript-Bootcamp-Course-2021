const express = require("express");

const usersRepo = require("../../repositories/users");
const signupTemplate = require("../../views/admin/auth/signup");
const signinTemplate = require("../../views/admin/auth/signin");

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
router.post("/signup", async (req, res) => {
	const { email, password, passwordConfirmation } = req.body;
	//check if user email excists
	const existingUser = await usersRepo.getOneBy({ email });
	if (existingUser) {
		return res.send("Email in use");
	}
	//check if passwords match
	if (password !== passwordConfirmation) {
		return res.send("Passwords must match");
	}
	//Create a user in user repo to reprisent this person
	const user = await usersRepo.create({ email, password });

	//Store the id of that user inside the users cookie (using 3rd party library "npm install cookie-session")
	req.session.userId = user.id;

	res.send("Account created!!!");
});

router.get("/signout", (req, res) => {
	req.session = null;
	res.send("You are logged out");
});

router.get("/signin", (req, res) => {
	res.send(signinTemplate());
});

router.post("/signin", async (req, res) => {
	const { email, password } = req.body;
	//check if user is registered
	const user = await usersRepo.getOneBy({ email });

	if (!user) {
		return res.send("Email not found");
	}
	const validPassword = await usersRepo.comparePasswords(user.password, password);
	if (!validPassword) {
		return res.send("Invalid password");
	}

	req.session.userId = user.id;
	return res.send("YOU are signed in!");
});

module.exports = router;
