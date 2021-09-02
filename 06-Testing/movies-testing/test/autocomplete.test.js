//Helper function to wait for an element to be ready for the test to be completed
const waitFor = selector => {
	return new Promise((resolve, reject) => {
		const interval = setInterval(() => {
			if (document.querySelector(selector)) {
				clearInterval(interval);
				clearTimeout(timeout);
				resolve();
			}
		}, 30);

		const timeout = setTimeout(() => {
			clearInterval(interval);
			reject();
		}, 20000);
	});
};

//code here will run before all test statements
beforeEach(() => {
	document.querySelector("#target").innerHTML = "";
	createAutoComplete({
		root: document.querySelector("#target"),
		fetchData() {
			return [{ Title: "Avengers" }, { Title: "Not Avengers" }, { Title: "Some other movie" }];
		},
		renderOption(movie) {
			return movie.Title;
		},
	});
});

//check if autocomplete dropdown apears on page load
it("Dropdown starts closed", () => {
	const dropdown = document.querySelector(".dropdown");

	expect(dropdown.className).not.to.include("is-active");
});

//check if dropdown shows when typing in search field
it("After searching dropdown opens up", async () => {
	const input = document.querySelector("input");
	input.value = "Avengers";
	input.dispatchEvent(new Event("input"));

	await waitFor(".dropdown-item");

	const dropdown = document.querySelector(".dropdown");
	expect(dropdown.className).to.include("is-active");
});

//check if dropdown shows results
it("After searching, displays some results", async () => {
	const input = document.querySelector("input");
	input.value = "Avengers";
	input.dispatchEvent(new Event("input"));

	await waitFor(".dropdown-item");

	const items = document.querySelectorAll(".dropdown-item");

	expect(items.length).to.equal(3);
});
