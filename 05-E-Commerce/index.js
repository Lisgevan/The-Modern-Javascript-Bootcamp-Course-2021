const express = require("express");
const usersRepo = require("./repositories/users");
const cookieSession = require("cookie-session");

//const bodyParser = require("body-parser"); (====>depreciated way)
const app = express();
// the .use(middlewareFunction) is used when we want all our wrap handlers (like app) to have that middleware we applied
app.use(express.urlencoded({ extended: true }));
app.use(
	cookieSession({
		keys: ["shlai4ytqi4tl43hvnl987"],
	})
);

//route handler
app.get("/signup", (req, res) => {
	res.send(`
        <div>
            Your Id is: ${req.session.userId}
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
app.post("/signup", async (req, res) => {
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

app.get("/signout", (req, res) => {
	req.session = null;
	res.send("You are logged out");
});

app.get("/signin", (req, res) => {
	res.send(`
        <div>
            <form method="POST">
                <input name="email" placeholder="email"/>
                <input name="password" placeholder="password"/>
                <button> Sign In </button>
            </form>
        <div>
    `);
});

app.post("/signin", async (req, res) => {
	const { email, password } = req.body;
	//check if user is registered
	const user = await usersRepo.getOneBy({ email });

	if (!user) {
		return res.send("Email not found");
	}
	if (user.password !== password) {
		return res.send("Invalid password");
	}

	req.session.userId = user.id;
	return res.send("YOU are signed in!");
});

app.listen(3000, () => {
	console.log("listening");
});
