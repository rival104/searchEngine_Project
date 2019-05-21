

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
