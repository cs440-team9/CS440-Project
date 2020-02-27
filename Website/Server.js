var express = require('express');
var bodyParser = require('body-parser');
//var mysql = require('./dbcon.js');
var cors = require('cors');

var app = express();

app.use(cors());
app.use(express.json());
app.set('port', 8088);

// Unnecessary, leaving as an example.
app.get('/', function (req, res, next) {
	res.json({ msg: 'Hello world!' });
});


// Set the server up on the selected port
app.listen(app.get('port'));