var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('./dbcon.js');
var cors = require('cors');

var app = express();

app.use(cors());
app.use(express.json());
app.set('port', 8088);

// Unnecessary, leaving as an example.
app.get('/', function (req, res, next) {
	res.json({ msg: 'Hello world!' });
});

// Fetch a table from the database that matches the passed tableID
app.get('/get_table/:tableID', function (req, res, next) {
	var id = req.params.tableID;

	var query = 'SELECT * FROM ' + id;

	mysql.pool.query(query, function (err, rows, fields) {
		if (err) {
			next(err);
			return;
		}

		res.json(rows);
	});
});


/***************** INSERT functions *****************/

// Add a row to ex_book
app.post('/add_to_book', function (req, res, next) {
	var ISBN = parseInt(req.body.ISBN.charAt(0));
	var datePublished = null;
	var title = req.body.title;
	var genre = req.body.genre;
	var authorID = parseInt(req.body.authorID.charAt(0));
	var publisherID = parseInt(req.body.publisherID.charAt(0));

	if (req.body.datePublished !== null) {
		datePublished = req.body.datePublished;
	}

	var query = `INSERT INTO ex_book
				(
					ISBN, date_published, title, genre, authorID, publisherID
				)
				VALUES
				(
					?, ?, ?, ?, ?, ?
				)`;

	mysql.pool.query(query, [ISBN, date_published, title, genre, authorID, publisherID], function (err, rows, fields) {
		if (err) {
			next(err);
			return;
		}

		res.json({ msg: 'Successfully inserted row into ex_book.' });
	});
});

// Add a row to ex_author
app.post('/add_to_author', function (req, res, next) {
	var name = req.body.name;
	var dob = req.body.dob
	var dod = null;

	if (req.body.dod !== null)
		dod = req.body.dod;

	var query = `INSERT INTO ex_author
				(
					name, dob, dod
				)
				VALUES
				(
					?, ?, ?
				)`;

	mysql.pool.query(query, [name, dob, dod], function (err, rows, fields) {
		if (err) {
			next(err);
			return;
		}

		res.json({ msg: 'Successfully inserted row into ex_author.' });
	});
});

// Add a row to ex_publisher
app.post('/add_to_publisher', function (req, res, next) {
	var name = req.body.name;

	var query = `INSERT INTO ex_publisher
				(
					name
				)
				VALUES
				(
					?
				)`;

	mysql.pool.query(query, [name], function (err, rows, fields) {
		if (err) {
			next(err);
			return;
		}

		res.json({ msg: 'Successfully inserted row into ex_publisher.' });
	});
});

// Set the server up on the selected port
app.listen(app.get('port'));