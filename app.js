const express = require('express');
const app = express();
const mongoose = require('mongoose');
const extractor = require('unfluff');
const request = require('request');


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


const options = {
    url: 'http://www.polygon.com/2014/6/26/5842180/shovel-knight-review-pc-3ds-wii-u'
};

function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
        // console.log(body);
		data = extractor(body, 'en');
		console.log(data);
		x = data;
		
    }
}
request(options, callback);


// Page.create({
// 	url:			"https://en.wikipedia.org/wiki/Main_Page",
// 	title: 			"Wikipedia",
// 	desc:			"Online encyclopedia",
// 	lastModified:	"05/14/2019",
// 	lastIndexed:	"05/15/2019",
// 	timeIndex:		5000
// }, function(err, pResult){
// 	if(err) console.log(err);
// 	else{
// 		Word.create({
// 			wordName:	"NoteBook"
// 		}, function (err2, wResult){
// 			if(err2) console.log(err2);
// 			else{
// 				PWord.create({
// 					pageId: [ 
// 						pResult._id 
// 					],
// 					wordId: [
// 						wResult._id 
// 					],
// 					frequency: 1
// 				}, function(err3, pWResult){
// 					if(err3) console.log(err3);
// 					else{
// 						console.log("CREATED!!!!");
// 					}
// 				});
// 			}
// 		});
// 	}
// });

// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://dbUser:<dbGt1213>@cluster0-9onmf.mongodb.net/test?retryWrites=true";
// const client = new MongoClient(uri, { useNewUrlParser: true });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });



app.get('/', async function (req, res){
	// res.send("Hello World!");
	let post = await Word.create({wordName: 'Janfog'});
	
	res.send(post);
});

app.get('/speak/:animal', function(req, res){
	var animal = req.params.animal;
	res.send("The "+animal+" says " + "Woof!");
});

app.listen(3000, function(){
	console.log("Server has started!");
});