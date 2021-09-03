const fs = require("fs");
const path = require("path");

class Runner {
	constructor() {
		this.testFiles = [];
	}

	async collectFiles(targetPath) {
		//find files and folders in directory
		const files = await fs.promises.readdir(targetPath);

		for (let file of files) {
			//create filepath of file
			const filepath = path.join(targetPath, file);
			//check if 'file' is directory or file
			const stats = await fs.promises.lstat(filepath);
			if (stats.isFile() && file.includes(".test.js")) {
				this.testFiles.push({ name: filepath });
			} else if (stats.isDirectory()) {
				const childFiles = await fs.promises.readdir(filepath);
				//we use the '...' to push childFiles items and not the whole array
				files.push(...childFiles.map(f => path.join(file, f)));
			}
		}
	}
}

module.exports = Runner;
