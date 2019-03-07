var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/';
var db;

MongoClient.connect(url, function (err, database) {
   if (err) {
      console.error('MongoDB Connection Failed', err);
      return;
   }

   db = database;
});

var users = db.Collection('users');

users.insert({ id:'khj68', password:'abc123'}).then(function(results) {
  // console.log('== Resolved\n', results);
  console.log('Promise Based Insert Result : ', results);
}, function(err) {
  console.log('== Rejected\n', err);      
});

// all users
users.find().toArray(function (err, docs) {
  console.log('== Find ALL, toArray');
  console.log(docs);
});

// projection
var projection = { _id: 0, title: 1 };
users.find({}, projection).toArray(function (err, docs) {
   console.log('== Find ALL with Projection');
   console.log(docs);
});

// Query
users.find({ id: 'khj68' }).toArray(function (err, docs) {
   console.log('== Find khj68');
   console.log(docs);
});

users.updateOne({ id: 'khj68' }, { $set: { password: 'changedPW' } }, function (err, result) {
  if (err) {
     console.error('UpdateOne Error ', err);
     return;
  }
  console.log('UpdateOne Success ', result);
});
