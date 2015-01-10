var express  	 = require('express');
var mysql	 	 = require('mysql');
var multer	 	 = require('multer');
var bodyParser	 = require('body-parser');
var path 		 = require('path');
var app 	     = express();

app.set('view engine','jade');

app.use(express.static(path.join(__dirname,'public')));

var dbCon = function(){
	var connection = mysql.createConnection(
		{port: 3306,user:'root',password:'',host:'localhost',database:'laravel'}
	);
	connection.connect();
	return connection;
}

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(multer()); // for parsing multipart/form-data

app.use(function(req,res,next){
	req.db = dbCon;
	next();
});

var userController = require('./controller/UserController');
var postController = require('./controller/PostController');
app.use('/user',userController);
app.use('/',postController);
app.listen('3000');

module.exports = app;