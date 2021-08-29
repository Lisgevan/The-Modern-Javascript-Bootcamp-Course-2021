const fs = require("fs");
const crypto = require("crypto");
const util = require("util");
const Repository = require("./repository");

const scrypt = util.promisify(crypto.scrypt);

class UsersRepository extends Repository {
	async create(attrs) {
		//create random user id
		attrs.id = this.randomId();

		//create salt for hash and hash
		const salt = crypto.randomBytes(8).toString("hex");
		const buf = await scrypt(attrs.password, salt, 64);

		//load users file
		const records = await this.getAll();
		const record = { ...attrs, password: `${buf.toString("hex")}.${salt}` };
		records.push(record);

		await this.writeAll(records);
		return record;
	}

	async comparePasswords(saved, supplied) {
		// const result = saved.split( '.' );
		// const hashed = result[ 0 ];
		// const salt = result[ 1 ];
		// they can be writen as:
		const [hashed, salt] = saved.split(".");
		const hashedSuppliedBuf = await scrypt(supplied, salt, 64);

		return hashed === hashedSuppliedBuf.toString("hex");
	}

	async writeAll(records) {
		//write the updated 'records' aray back to this.filename
		await fs.promises.writeFile(this.filename, JSON.stringify(records, null, 2));
	}
}

module.exports = new UsersRepository("users.json");
