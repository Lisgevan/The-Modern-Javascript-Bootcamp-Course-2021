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

	if (responce.data.Error) {
		return [];
	}

	return responce.data.Search;
};

const root = document.querySelector(".autocomplete");
root.innerHTML = `
    <label><b>Search for a movie</b></label>
    <input class='input' />
	<div class="dropdown">
        <div class="dropdown-menu">
          <div class="dropdown-content results">
            
          </div>
        </div>
      </div>
`;

const input = document.querySelector("input");
const dropdown = document.querySelector(".dropdown");
const results = document.querySelector(".results");

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

const onInput = async event => {
	const movies = await fetchData(event.target.value);
	console.log(movies);
	for (let movie of movies) {
		console.log(movie.Poster);
		const div = document.createElement("div");
		div.innerHTML = `
            <img src="${movie.Poster}"/>
            <h1> ${movie.Title}</h1>
        `;
		document.querySelector("#target").appendChild(div);
	}
};

input.addEventListener("input", debounce(onInput, 500));
