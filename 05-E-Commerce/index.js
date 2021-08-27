const express = require("express");
const usersRepo = require("./repositories/users");
//const bodyParser = require("body-parser"); (====>depreciated way)

const app = express();
// the .use(middlewareFunction) is used when we want all our wrap handlers (like app) to have that middleware we applied
app.use(express.urlencoded({ extended: true }));

//route handler
app.get("/", (req, res) => {
	res.send(`
    <div>
        <form method="POST">
            <input name="email" placeholder="email"/>
            <input name="password" placeholder="password"/>
            <input name="passwordConfirmation" placeholder="password confirmation"/>
            <button> Sign Up </button>
        </form>
    <div>
    `);
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
// app.post("/", bodyParser, (req, res) => {
// 	console.log(req.body);
// 	res.send("Account created!!!");
// });

// app.post("/", bodyParser.urlencoded({ extended:true}), (req, res) => {    (===========> deprecited)
//(new way of doing the same thing)
app.post("/", async (req, res) => {
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

	res.send("Account created!!!");
});

app.listen(3000, () => {
	console.log("listening");
});
