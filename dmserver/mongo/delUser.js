var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017';

MongoClient.connect(url, function(err, db){
	if(err) throw err;
	var dbo = db.db('users');
	var users = dbo.collection('users');

	users.deleteOne({id:'khj68'}, function(err, result){
		if(err){
			console.error('DeleteOne Error ',err);
			return;
		}
		console.log('DeleteOne Success', result);
	});
});
