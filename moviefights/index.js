// Here is your key: b9230ca0
// Please append it to all of your API requests,
// OMDb API: http://www.omdbapi.com/?i=tt3896198&apikey=b9230ca0

//helper function to fetch results
const fetchData = async searchTerm => {
	const responce = await axios.get("http://www.omdbapi.com/", {
		params: {
			apikey: "b9230ca0",
			s: searchTerm,
		},
	});

	console.log(responce.data);
};

const input = document.querySelector("input");

// //fetch data when user stops typing for 1000 milisecs
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

const onInput = event => {
	fetchData(event.target.value);
};

input.addEventListener("input", debounce(onInput, 500));
