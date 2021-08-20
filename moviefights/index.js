// Here is your key: b9230ca0
// Please append it to all of your API requests,
// OMDb API: http://www.omdbapi.com/?i=tt3896198&apikey=b9230ca0

//helper function to fetch results
const fetchData = async () => {
	const responce = await axios.get("http://www.omdbapi.com/", {
		params: {
			apikey: "b9230ca0",
			i: "tt0848228",
		},
	});

	console.log(responce.data);
};

fetchData();
