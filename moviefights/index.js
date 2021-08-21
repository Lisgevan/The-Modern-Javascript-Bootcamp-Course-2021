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
}; //end

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
const resultsWrapper = document.querySelector(".results");

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
	const movies = await fetchData(event.target.value);

	console.log(movies);
	//hide dropdown if there are no resuls
	if (!movies.length) {
		dropdown.classList.remove("is-active");
		return;
	} //end

	//create dropdown options
	resultsWrapper.innerHTML = "";
	dropdown.classList.add("is-active");
	for (let movie of movies) {
		const option = document.createElement("a");
		const imgSrc = movie.Poster === "N/A" ? "" : movie.Poster;
		const yearSrc = movie.Year === "N/A" ? "" : movie.Year;

		input.value = ""; //delete input and wait for user selection
		option.classList.add("dropdown-item");
		option.innerHTML = `
            <img src="${imgSrc}"/>
            ${movie.Title} (${yearSrc})
        `;
		option.addEventListener("click", event => {
			dropdown.classList.remove("is-active");
			input.value = movie.Title;
			onMovieSelect(movie);
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

const onMovieSelect = async movie => {
	const responce = await axios.get("http://www.omdbapi.com/", {
		params: {
			apikey: "b9230ca0",
			i: movie.imdbID,
		},
	});
	console.log(responce.data);
	document.querySelector("#summary").innerHTML = movieTemplate(responce.data);
};

const movieTemplate = movieDetail => {
	return `
		<article class="media">
  			<figure class="media-left">
    			<p class="image">
      				<img src="${movieDetail.Poster}" alt="${movieDetail.Title}">
   				 </p>
			</figure>
			<div class="media-content">
			<div class="content">
				<h1>${movieDetail.Title}</h1>
				<h4>${movieDetail.Genre}</h4>
				<p>${movieDetail.Plot}</p>
			</div>
			</div>
		</article>
		<article class="notification is-primary">
			<p class="title">${movieDetail.Awards}</p>
			<p class="subtitle">Awards</p>
		</article>
		<article class="notification is-primary">
			<p class="title">${movieDetail.BoxOffice}</p>
			<p class="subtitle">Box Office</p>
		</article>
		<article class="notification is-primary">
			<p class="title">${movieDetail.Metascore}</p>
			<p class="subtitle">Metascore</p>
		</article>
		<article class="notification is-primary">
			<p class="title">${movieDetail.imdbRaing}</p>
			<p class="subtitle">IMDB Rating</p>
		</article>
		<article class="notification is-primary">
			<p class="title">${movieDetail.imdbVotes}</p>
			<p class="subtitle">IMDB Votes</p>
		</article>
	`;
};
