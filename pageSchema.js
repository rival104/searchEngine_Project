const mongoose = require('mongoose');

const PageSchema = new mongoose.Schema({
	url:			String,
	title: 			String,
	desc:			String,
	lastModified:	String,
	lastIndexed:	String,
	timeIndex:		Number
	
});

const Page = mongoose.model("Page", PageSchema);


module.exports = Page;