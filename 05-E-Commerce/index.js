const express = require("express");
const cookieSession = require("cookie-session");
const authRouter = require("./routes/admin/auth");
const adminProductsRouter = require("./routes/admin/products");
const productsRouter = require("./routes/products");
const cartsRouter = require("./routes/carts");

//const bodyParser = require("body-parser"); (====>depreciated way)
const app = express();

// the .use(middlewareFunction) is used when we want all our wrap handlers (like app) to have that middleware we applied
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(
	cookieSession({
		keys: ["shlai4ytqi4tl43hvnl987"],
	})
);
app.use(authRouter);
app.use(adminProductsRouter);
app.use(productsRouter);
app.use(cartsRouter);

app.listen(3000, () => {
	console.log("listening");
});
