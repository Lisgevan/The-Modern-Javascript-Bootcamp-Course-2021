const path = require("path");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const render = async filename => {
	const filePath = path.join(process.cwd(), filename);

	const dom = await JSDOM.fromFile(filePath, {
		runScripts: "dangerously",
		resources: "usable",
	});
	//wait for js scripts to be loaded before we run any tests
	return new Promise((resolve, reject) => {
		dom.window.document.addEventListener("DOMContentLoaded", () => {
			resolve(dom);
		});
	});
};

module.exports = render;
