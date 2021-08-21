const createAutoComplete = ({ root, renderOption, onOptionSelect, inputValue, fetchData }) => {
	// const root = document.querySelector(".autocomplete");
	root.innerHTML = `
        <label><b>Search</b></label>
        <input class='input' />
        <div class="dropdown">
            <div class="dropdown-menu">
              <div class="dropdown-content results">
            
              </div>
            </div>
        </div>
    `;

	const input = root.querySelector("input");
	const dropdown = root.querySelector(".dropdown");
	const resultsWrapper = root.querySelector(".results");

	// For reference only code//fetch data when user stops typing for 1000 milisecs
	// let timeoutId;
	// const onInput = event => {
	// 	if (timeoutId) {
	// 		clearTimeout(timeoutId);
	// 	}
	// 	timeoutId = setTimeout(() => {
	// 		fetchData(event.target.value);
	// 	}, 1000);
	// };

	//refactored function to be reusable and better to understand
	// //moved to utils.js
	// const debounce = (func, delay=1000) => {
	// 	let timeoutId;
	// 	return (...args) => {
	// 		if (timeoutId) {
	// 			clearTimeout(timeoutId);
	// 		}
	// 		timeoutId = setTimeout(() => {
	// 			func.apply(null, args);
	// 		}, delay);
	// 	};
	// };

	const onInput = async event => {
		const items = await fetchData(event.target.value);

		console.log(items);
		//hide dropdown if there are no resuls
		if (!items.length) {
			dropdown.classList.remove("is-active");
			return;
		} //end

		//create dropdown options
		resultsWrapper.innerHTML = "";
		dropdown.classList.add("is-active");
		for (let item of items) {
			const option = document.createElement("a");

			input.value = ""; //delete input and wait for user selection
			option.classList.add("dropdown-item");
			option.innerHTML = renderOption(item);
			option.addEventListener("click", event => {
				dropdown.classList.remove("is-active");
				input.value = inputValue(item);
				onOptionSelect(item);
			});

			resultsWrapper.appendChild(option);
		} //end
	};

	input.addEventListener("input", debounce(onInput, 500));

	//close dropdown if you click out of the results
	document.addEventListener("click", event => {
		if (!root.contains(event.target)) {
			dropdown.classList.remove("is-active");
		}
	}); //end
};
