var express = require('express');
var http = require('http');
var serveStatic = require('serve-static');
var path = require('path');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var expressErrorHandler = require('express-error-handler');
var mongoClient = require('mongodb').MongoClient;

var database;

function connectDB(){
	var databaseURL = 'mongodb://localhost:27017';
	mongoClient.connect(databaseURL,
		function(err, db){
			if(err){
				console.log('db connect error');
				return;
			}

			console.log('db was connected : ' + databaseURL);
			database = db;
		}
	);
}

var app = express();

app.use('port', process.env.PORT || 9000);
app.use('public', serveStatic(path.join(__dirname, 'public')));

var bodyParser_post = require('body-parser');
app.use(bodyParser_post.urlencoded({ extended: false }));
app.use(bodyParser_post.json());

app.use(serveStatic(path.join(__dirname, 'public')));

app.use(cookieParser());

app.use(expressSession({
	secret: 'my key',
	resave: true,
	saveUninitialized: true
}));

var router = express.Router();

router.route('/process/login').post(
	function(req, res){
		console.log('process/login called');
		var paramID = req.body.id || req.query.id;
		var paramPW = req.body.passwords || req.query.passwords;
		console.log('paramID : ' + paramID + ', paramPW : ' + paramPW);

		if(database){
			authUser(database, paramID, paramPW,
				function(err, docs){
					if(database){
						if(err){
							console.log('Error!');
							res.writeHead(200, {"Content-Type": "text/html;characterset=utf8"});
							res.write('<h1>error occur</h1>');
							res.end();
							return;
						}

						if(docs){
							console.dir(docs);
							res.writeHead(200, {"Content-Type": "text/html;characterset=utf8"});
							res.write('<h1>Login Success</h1>');
							res.write('<h1> user </h1>' + docs[0].name);
							res.write('<br><a href="/login.html"> re login </a>');
							res.end();
						}else{
							console.log('empty error!');
							res.writeHead(200, {"Content-Type": "text/html;characterset=utf8"});
							res.write('<h1>user data not exist</h1>');
							res.write('<a href="/login.html"> re login</a>');
							res.end();
						}
					}else{
						console.log('empty error!');
						rew.writeHead(200, {"Content-Type": "text/html;characterset=utf8"});
						res.write('<h1>database not connected');
						res.end();
					}
				}
			);
		}
	}
);

app.use('/', router);

var authUser = function(db, id, password, callback){
	console.log('input id : ' +id + ' : pw : ' + password);
	var users = db.db('test').collection('users');

	var result = users.find({"name":id, "passwords" : parseInt(password) });

	result.toArray(
		function(err, docs){
			if(err){
				callback(err,null);
				return;
			}
			if(docs.length>0){
				console.log('find user [ ' + docs + ' ]');
				callback(null, docs);
			}else{
				console.log('can not find user [ ' + docs + ' ]');
				callback(null, null);
			}
		}
	);
};

var errorHandler = expressErrorHandler(
	{static: {'404': '.public/404.html'}}
);

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);

var appServer = http.createServer(app);
appServer.listen(app.get('post'),
	function(){
		console.log('express web server started' + app.get('port'));
		connectDB();
	}
);
