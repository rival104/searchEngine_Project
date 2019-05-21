const express = require('express');
const app = express();
const mongoose = require('mongoose');
const extractor = require('unfluff');
const request = require('request');
const rp = require('request-promise');


mongoose.connect('mongodb+srv://dbUser:dbGt1213@cluster0-9onmf.mongodb.net/test?retryWrites=true', {
	useNewUrlParser: true,
	useCreateIndex: true
}).then(()=>{
	console.log('Connected to DB!');
}).catch(err=> {
	console.log('Error: ', err.message);
});

const Word= require('./wordSchema.js');
const Page= require('./pageSchema.js');
const PWord= require('./pageWordSchema.js');
const Search= require('./searchSchema.js');



function crawlerEngine(urls){
	rp(urls)
    .then(function (htmlString) {
        // Process html...
		// console.log(htmlString);
	
		       
		data = extractor(htmlString, 'en');
		// console.log(data);
		
		const date = new Date();
		console.log(data.title);
		console.log(data.description);
		console.log(data.date);
		console.log(data.canonicalLink);
		console.log(date);
		// console.log(data.text);
		
		//readline
		var res = data.text.split(/\b(\w+)\b/g);
		// console.log(res);

		var wordMap = {};

		for(var i=0; i<res.length; i++){
			if(!(res[i] in wordMap)){
				wordMap[res[i]] = 1;
			}
			else{
				wordMap[res[i]] = (wordMap[res[i]] || 0) + 1;
			}
		}

    	// console.log(wordMap);
	
		const entries = Object.entries(wordMap);
		
		// // console.log(entries);
		// for (const [word, freq] of entries) {
		//   console.log(`There are ${freq} ${word}s`);
		// }

		//databse entry 
		Page.create({
			url:			data.canonicalLink,
			title: 			data.title,
			desc:			data.description,
			lastModified:	data.date,
			lastIndexed:	date,
			timeIndex:		500
		},function(err, pResult){
			if(err) console.log(err);
			else{
				for (const [word, freq] of entries) {
				  console.log(`There are ${freq} ${word}s`);
					
						Word.create({
						wordName:	word
					}, function (err2, wResult){
						if(err2) console.log(err2);
						else{
							PWord.create({
								pageId: [ 
									pResult._id 
								],
								wordId: [
									wResult._id 
								],
								frequency: freq
							}, function(err3, pWResult){
								if(err3) console.log(err3);
								else{
									console.log("CREATED!!!!");
								}
							});
						}
					});
				}
				
				
			}
		});

    })
    .catch(function (err) {
        // Crawling failed...
		console.log(err);
    });
}

// crawlerEngine('http://www.polygon.com/2014/6/26/5842180/shovel-knight-review-pc-3ds-wii-u');
// crawlerEngine("http://www.cnn.com/2014/07/07/world/americas/mexico-earthquake/index.html");





app.get('/', function (req, res){
	// res.send("Hello World!");
	// let post = await Word.create({wordName: 'Janfog'});
	
	res.render("homepage.ejs");
});

app.get('/speak/:animal', function(req, res){
	var animal = req.params.animal;
	res.send("The "+animal+" says " + "Woof!");
});

app.listen(3000, function(){
	console.log("Server has started!");
});