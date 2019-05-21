const express = require('express');
const app = express();
const mongoose = require('mongoose');
const extractor = require('unfluff');
const bodyParser  = require("body-parser");
const request = require('request');
const rp = require('request-promise');

app.use(express.static("public"));
app.set("view engine", "ejs");
var ObjectId = require('mongodb').ObjectId;

//connect to database
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


//Indexing Engine
function crawlerEngine(urls, rec){
	
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
				for (let [word, freq] of entries) {
					word = word.toLowerCase();
				  // console.log(`There are ${freq} ${word}s`);
					
					//if word find empty
					Word.find({wordName:word}, function(errf, wResult){
						if(errf) console.log(errf);
						else{
							if(wResult.length == 0){
								Word.create({wordName:	word}, function (err2, wResult2){
								if(err2) console.log(err2);
								else{
									// console.log("in create");
									// console.log(wResult2);
									PWord.create({
										pageId: [ 
											pResult._id 
										],
										wordId: [
											wResult2._id 
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
							}else{
								// console.log("in found");
									// console.log(wResult);
								PWord.create({
										pageId: [ 
											pResult._id 
										],
										wordId: [
											wResult[Object.keys(wResult)[0]]._id 
										],
										frequency: freq
									}, function(err3, pWResult){
										if(err3) console.log(err3);
										else{
											console.log("Updated!!!!");
										}
									});
								// console.log("found; " + word);
								// Word.find({wordName:word}, function (err3, wResult){
								// if(err3) console.log(err3);
								// else{
								// 	console.log("in found");
								// 	console.log(wResult);
								// 	PWord.create({
								// 		pageId: [ 
								// 			pResult._id 
								// 		],
								// 		wordId: [
								// 			wResult._id 
								// 		],
								// 		frequency: freq
								// 	}, function(err3, pWResult){
								// 		if(err3) console.log(err3);
								// 		else{
								// 			console.log("Updated!!!!");
								// 		}
								// 	});
								// }
								// });
							}
							
						}
					});
						
				}
				
				
			}
		});//page create
		
		//recursive search
		if(rec == "on"){
			console.log(data.links);
			const href = Object.entries(data.links);
			for (let [prop, obj] of href) {
				if(obj.href.length > 10){
					console.log(obj.href);
					crawlerEngine(obj.href);
				}	
			}
		}
		

    })
    .catch(function (err) {
        // Crawling failed...
		console.log(err);
    });
}

// crawlerEngine('http://www.polygon.com/2014/6/26/5842180/shovel-knight-review-pc-3ds-wii-u');
// crawlerEngine("http://www.cnn.com/2014/07/07/world/americas/mexico-earthquake/index.html");




//Routing

app.get('/', function (req, res){
	// res.send("Hello World!");
	// let post = await Word.create({wordName: 'Janfog'});
	// console.log(Page.find({title: "Shovel Knight review"}));
	// Page.find({title: "Shovel Knight review"}, function(err, page){
	// if(err){
	// console.log("OH NO, ERROR!");
	// console.log(err);
	// } else {
	// console.log("ALL THE CATS.....");
	// console.log(page);
	// }
	// });
	
	
	// Word.find({wordName: "past"}, function(err, word){
	// 	if(err){
	// 		console.log("OH NO, ERROR!");
	// 		console.log(err);
	// 	} else {
	// 		console.log("ALL THE WORDS.....");
	// 		console.log(word);
	// 		console.log(word[Object.keys(word)[0]]._id);
	// 		console.log(word.length == 0);

	// 	}
	// 	});
	
	// PWord.find({wordId: ObjectId("5ce36588c8eef57697a6f416")}, function(err, pw){
	// 		if(err){
	// 			console.log("OH NO, ERROR!");
	// 			console.log(err);
	// 		} else {
	// 			console.log("ALL THE pw.....");
	// 			console.log(pw);
	// 		}
	// });
	
	// var o_id = new ObjectId("5ce3f8891347db09e19f42c7");
	// PWord.find({pageId: o_id}, function(err, pw){
	// 		if(err){
	// 			console.log("OH NO, ERROR!");
	// 			console.log(err);
	// 		} else {
	// 			console.log("ALL THE pw.....");
	// 			console.log(pw);
	// 		}
	// 		});
	
	res.render("homepage");
	console.log("done");
});

app.get("/addIndex", function(req, res){
    var newIndex = req.query.newUrl;
	var rec = req.query.rec;
	console.log("rec");
	console.log(rec);
    crawlerEngine(newIndex, rec);
	// res.send("<script>\r\nfunction myFunction() {\r\n  alert(\"Url information added to database\");\r\n}\r\nmyFunction()\r\n</script>");
    res.redirect("/");
});

app.get("/showResults", async function(req, res){
    var term = req.query.searchTerm;
	if(req.query.caseIgnore == "on"){
		term = term.toLowerCase();
	}
	   Word.find({wordName: term}, function(err, word){
		if(err || word.length == 0){
			console.log("OH NO, ERROR!");
			console.log(err);
			res.send("Not Found");
		} else {
			console.log("ALL THE WORDS.....");
			console.log(word);
			var wordID = word[Object.keys(word)[0]]._id;
			var o_id = new ObjectId(wordID);
			
			PWord.find({wordId: o_id}, function(err, pw){
			if(err){
				console.log("OH NO, ERROR!");
				console.log(err);
			} else {
				console.log("ALL THE pw.....");
				console.log(pw[Object.keys(word)[0]].pageId);
				var id = pw[Object.keys(word)[0]].pageId;
				
				//search History
				const date = new Date();
				var count = 0;
				for (var k in pw) {
					if (pw.hasOwnProperty(k)) {
					   ++count;
					}
				}
				Search.create({
					terms:			term,
					count: 			count,
					searchDate:		date,
					timeToSearch:	500
				},function(err, pResult){
				});
				
				// Page.findById(id, 'title desc', function (err, page) {console.log(page);});
				
				// for (const prop in pw) {
				// 	 Page.findById(pw[prop].pageId, 'title desc url', function (err,page){  // console.log(page);
				// 	 });
				// }
				
			
				res.render("results", {data: pw});
			}
			});
		}
		});
    // res.redirect("/");
});

app.get("/page/:id", function(req, res){
    //find the page with provided ID
	Page.findById(req.params.id, function (err, page){ 
		if(err){
            console.log(err);
        } else {     
            //render show template with that page
            res.render("page", {page: page});
        }     
    });
});

app.get("/searchH", function(req, res){
    //find the page with provided ID
	Search.find(function (err, sh){ 
		if(err){
            console.log(err);
        } else {     
            //render show template with that page
			
            res.render("searchH", {data: sh});
        }     
    });
});



app.listen(3000, function(){
	console.log("Server has started!");
});