// Here is your key: b9230ca0
// Please append it to all of your API requests,
// OMDb API: http://www.omdbapi.com/?i=tt3896198&apikey=b9230ca0

//funtion called to autcomplete/render page. all parameters are passed here.
const autoCompleConfig = {
	renderOption(movie) {
		const imgSrc = movie.Poster === "N/A" ? "" : movie.Poster;
		const yearSrc = movie.Year === "N/A" ? "" : movie.Year;
		return `
                <img src="${imgSrc}"/>
                ${movie.Title} (${yearSrc})
            `;
	},
	inputValue(movie) {
		return movie.Title;
	},
	async fetchData(searchTerm) {
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
	},
};

createAutoComplete({
	...autoCompleConfig,
	root: document.querySelector("#left-autocomplete"),
	onOptionSelect(movie) {
		document.querySelector(".tutorial").classList.add("is-hidden");
		onMovieSelect(movie, document.querySelector("#left-summary"), "left");
	},
});
createAutoComplete({
	...autoCompleConfig,
	root: document.querySelector("#right-autocomplete"),
	onOptionSelect(movie) {
		document.querySelector(".tutorial").classList.add("is-hidden");
		onMovieSelect(movie, document.querySelector("#right-summary"), "right");
	},
});

let leftMovie;
let rightMovie;
const onMovieSelect = async (movie, summaryElement, side) => {
	const responce = await axios.get("http://www.omdbapi.com/", {
		params: {
			apikey: "b9230ca0",
			i: movie.imdbID,
		},
	});
	console.log(responce.data);
	summaryElement.innerHTML = movieTemplate(responce.data);
	if (side === "left") {
		leftMovie = responce.data;
	} else {
		rightMovie = responce.data;
	}
	if (leftMovie && rightMovie) {
		runComparison();
	}
};

const runComparison = () => {
	const leftSideStats = document.querySelectorAll("#left-summary .notification");
	const rightSideStats = document.querySelectorAll("#right-summary .notification");
	console.log(leftSideStats, rightSideStats);

	leftSideStats.forEach((leftStat, index) => {
		const rightStat = rightSideStats[index];
		const leftSideValue = parseInt(leftStat.dataset.value);
		const rightSideValue = parseInt(rightStat.dataset.value);

		if (rightSideValue > leftSideValue) {
			leftStat.classList.remove("is-primary");
			leftStat.classList.add("is-warning");
		} else {
			rightStat.classList.remove("is-primary");
			rightStat.classList.add("is-warning");
		}
	});
};

const movieTemplate = movieDetail => {
	// make properties we display to easy to compare number formats
	// then add them as data properties at the elements the show them so we can compare them
	const dollars = parseInt(movieDetail.BoxOffice.replace(/\$/g, "").replace(/,/g, ""));
	const metascore = parseInt(movieDetail.Metascore);
	const imdbRating = parseFloat(movieDetail.imdbRating);
	const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ""));
	const awards = movieDetail.Awards.split(" ").reduce((prev, word) => {
		const value = parseInt(word);
		if (isNaN(word)) {
			return prev;
		} else {
			return prev + value;
		}
	});

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
		<article data-value=${awards} class="notification is-primary">
			<p class="title">${movieDetail.Awards}</p>
			<p class="subtitle">Awards</p>
		</article>
		<article data-value=${dollars} class="notification is-primary">
			<p class="title">${movieDetail.BoxOffice}</p>
			<p class="subtitle">Box Office</p>
		</article>
		<article data-value=${metascore} class="notification is-primary">
			<p class="title">${movieDetail.Metascore}</p>
			<p class="subtitle">Metascore</p>
		</article>
		<article data-value=${imdbRating} class="notification is-primary">
			<p class="title">${movieDetail.imdbRating}</p>
			<p class="subtitle">IMDB Rating</p>
		</article>
		<article data-value=${imdbVotes} class="notification is-primary">
			<p class="title">${movieDetail.imdbVotes}</p>
			<p class="subtitle">IMDB Votes</p>
		</article>
	`;
};
