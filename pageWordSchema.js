const mongoose = require('mongoose');

const PWordSchema = new mongoose.Schema({
	pageId: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Page"
		}
	],
	wordId: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Word"
		}
	],
	frequency: Number
});

const PWord = mongoose.model("PWord", PWordSchema);


module.exports = PWord;