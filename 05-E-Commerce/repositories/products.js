const Repository = require("./repository");

class ProductsRepository extends Repository {}

module.export = new ProductsRepository("products.json");
