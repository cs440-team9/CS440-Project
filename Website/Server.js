var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('./dbcon.js');
var cors = require('cors');
var moment = require('moment');

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
	var ISBN = req.body.ISBN;
	var date_published = null;
	var title = req.body.title;
	var genre = req.body.genre;
	var authorID = req.body.authorID;
	var publisherID = req.body.publisherID;

	if (req.body.datePublished !== null)
		date_published = req.body.date_published;

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



/***************** UPDATE functions *****************/

// Update a row in ex_book based on the ISBN in the body
app.put('/update_book', function (req, res, next) {
	var ISBN = req.body.ISBN;
	var date_published = null;
	var title = req.body.title;
	var genre = req.body.genre;
	var authorID = req.body.authorID;
	var publisherID = req.body.publisherID;

	if (req.body.datePublished !== null)
		date_published = req.body.date_published;

	var query = `UPDATE ex_book
				SET ISBN = ?, date_published = ?, title = ?, genre = ?, authorID = ?, publisherID = ?
				WHERE ISBN = ?`;

	mysql.pool.query(query, [ISBN, date_published, title, genre, authorID, publisherID, ISBN], function (err, rows, fields) {
		if (err) {
			next(err);
			return;
		}

		res.json({ msg: 'Successfully updated row ' + ISBN });
	});
});

// Update a row in ex_author based on the authorID in the body
app.put('/update_author', function (req, res, next) {
	var authorID = req.body.authorID;
	var name = req.body.name;
	var dob = req.body.dob
	var dod = null;

	if (req.body.dod !== null)
		dod = req.body.dod;

	var query = `UPDATE ex_author
				SET name = ?, dob = ?, dod = ?
				WHERE authorID = ?`;

	mysql.pool.query(query, [name, dob, dod, authorID], function (err, rows, fields) {
		if (err) {
			next(err);
			return;
		}

		res.json({ msg: 'Successfully updated row ' + authorID });
	});
});

// Update a row in ex_publisher based on the publisherID in the body
app.put('/update_publisher', function (req, res, next) {
	var publisherID = req.body.publisherID;
	var name = req.body.name;

	var query = `UPDATE ex_publisher
				SET name = ?
				WHERE publisherID = ?`;

	mysql.pool.query(query, [name, publisherID], function (err, rows, fields) {
		if (err) {
			next(err);
			return;
		}

		res.json({ msg: 'Successfully updated row ' + publisherID });
	});
});



/***************** DELETE functions *****************/

// Delete a row from ex_book based on the ISBN in the body
app.delete('/delete_book', function (req, res, next) {
	var ISBN = req.body.ISBN;

	var query = `DELETE FROM ex_book
				WHERE ISBN = ?`;

	mysql.pool.query(query, [ISBN], function (err, rows, fields) {
		if (err) {
			next(err);
			return;
		}

		res.json({ msg: 'Successfully deleted row ' + ISBN + ' from ex_book' });
	});
});

// Delete a row from ex_author based on the authorID in the body
app.delete('/delete_author', function (req, res, next) {
	var authorID = req.body.authorID;

	/* Can't delete an author that's in use in ex_book.
	 * Must delete any entry in ex_book using said author first. */
	var query1 = `DELETE FROM ex_book
				WHERE authorID = ?`;

	mysql.pool.query(query1, [authorID], function (err, rows, fields) {
		if (err) {
			next(err);
			return;
		}
	});

	// Wait for one second to ensure that delete happened, to avoid foreign key constraint
	setTimeout(function () {
		// Now that foreign key constraints are deleted, delete from ex_author
		var query2 = `DELETE FROM ex_author
					WHERE authorID = ?`;

		mysql.pool.query(query2, [authorID], function (err, rows, fields) {
			if (err) {
				next(err);
				return;
			}

			res.json({ msg: 'Successfully deleted rows in ex_book with authorID ' + authorID + '. Successfully deleted row ' + authorID + ' from ex_author' });
		});
	}, 1000);
});

// Delete a row from ex_publisher based on the publisherID in the body
app.delete('/delete_publisher', function (req, res, next) {
	var publisherID = req.body.publisherID;

	/* Can't delete a publisher that's in use in ex_book.
	 * Must delete any entry in ex_book using said publisher first. */
	var query1 = `DELETE FROM ex_book
				WHERE publisherID = ?`;

	mysql.pool.query(query1, [publisherID], function (err, rows, fields) {
		if (err) {
			next(err);
			return;
		}
	});

	// Wait for one second to ensure that delete happened, to avoid foreign key constraint
	setTimeout(function () {
		// Now that foreign key constraints are deleted, delete from ex_publisher
		var query2 = `DELETE FROM ex_publisher
					WHERE publisherID = ?`;

		mysql.pool.query(query2, [publisherID], function (err, rows, fields) {
			if (err) {
				next(err);
				return;
			}

			res.json({ msg: 'Successfully deleted rows in ex_book with publisherID ' + publisherID + '. Successfully deleted row ' + publisherID + ' from ex_publisher' });
		});
	}, 1000);	
});

// Set the server up on the selected port
app.listen(app.get('port'));