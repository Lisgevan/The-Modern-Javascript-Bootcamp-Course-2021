// Here is your key: b9230ca0
// Please append it to all of your API requests,
// OMDb API: http://www.omdbapi.com/?i=tt3896198&apikey=b9230ca0

//funtion called to autcomplete/render page. all parameters are passed here.
createAutoComplete({
	root: document.querySelector(".autocomplete"),
	renderOption(movie) {
		const imgSrc = movie.Poster === "N/A" ? "" : movie.Poster;
		const yearSrc = movie.Year === "N/A" ? "" : movie.Year;
		return `
                <img src="${imgSrc}"/>
                ${movie.Title} (${yearSrc})
            `;
	},
	onOptionSelect(movie) {
		onMovieSelect(movie);
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
});

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
