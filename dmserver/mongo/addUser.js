var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017';

MongoClient.connect(url, function(err, db){
	if(err) throw err;
	var dbo = db.db('users');
	var obj = { id: 'khj68', password: 'asd123'};
	dbo.collection('users').insertOne(obj, function(err, res){
		if(err) throw err;
		console.log('1 document inserted');
		db.close();
	});
});
