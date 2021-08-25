const fs = require("fs");
const crypto = require("crypto");

class UsersRepository {
	constructor(filename) {
		if (!filename) {
			throw new Error("Creating a repository requires a filename");
		}

		this.filename = filename;
		try {
			fs.accessSync(this.filename);
		} catch (err) {
			fs.writeFileSync(this.filename, "[]");
		}
	}

	async getAll() {
		//open file called this.filename parse the contents and return the parsed data
		return JSON.parse(await fs.promises.readFile(this.filename, { encoding: "utf8" }));
	}

	async create(attrs) {
		//create random user id
		attrs.id = this.randomId();
		//load users file
		const records = await this.getAll();
		records.push(attrs);
		await this.writeAll(records);
	}
	async writeAll(records) {
		//write the updated 'records' aray back to this.filename
		await fs.promises.writeFile(this.filename, JSON.stringify(records, null, 2));
	}

	randomId() {
		return crypto.randomBytes(4).toString("hex");
	}
}

//for testing
const test = async () => {
	const repo = new UsersRepository("users.json");

	await repo.create({ email: "test@test.com", password: "password" });

	const users = await repo.getAll();

	console.log(users);
};

test();
