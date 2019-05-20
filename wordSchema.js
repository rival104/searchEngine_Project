const mongoose = require('mongoose');

const WordSchema = new mongoose.Schema({
	wordName:	String
});

const Word = mongoose.model("Word", WordSchema);


module.exports = Word;