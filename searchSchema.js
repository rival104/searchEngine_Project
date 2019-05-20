const mongoose = require('mongoose');

const SearchSchema = new mongoose.Schema({
	terms: String,
	count: Number,
	searchDate: String,
	timeToSearch: Number
});

const Search = mongoose.model("Search", SearchSchema);


module.exports = Search;