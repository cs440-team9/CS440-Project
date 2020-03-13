const request = require('request-promise-native');
const sql = require('mysql');
const ObjectsToCsv = require('objects-to-csv');

const mysql = require('mysql');
const sqlPool = mysql.createPool({
  connectionLimit: 10,
  host: 'classmysql.engr.oregonstate.edu',
  user: 'cs440_group09',
  password: 'tHAjRjkkPz5K',
  database: 'cs440_group09'
});

// import credentials
// const { openlibrary } = require('./config').credentials;

// const bookEntries = [];

async function getBooks() {
  let bookEntries = [];

  // In ASCII, 'A' is 65 and 'Z' is 90
  for (let i = 65; i <= 90; i++) {
    try {
      let response = await request({
        uri: 'http://openlibrary.org/search.json',
        qs: {
          // Add extra alphabet letters to the query for more data
          title: String.fromCharCode(i) + process.argv[2],  // search query
        }
      });
      // console.log(response);
      response = JSON.parse(response);
      let books = response.docs;
      // console.log(books);
      if (books) {
        for (let book of books) {
          let entry = {
            title: book.title_suggest,
            isbn: book.isbn && book.isbn[0],
            author: book.author_name && book.author_name[0],
            publisher: book.publisher && book.publisher[0],
            date_published: book.publish_year && book.publish_year[0]
          };
          // console.log(entry);
          bookEntries.push(entry);
        }
      }

    } catch (err) {
      console.error(err);
    }
  }

  return bookEntries;
}


async function main() {
  try {
    console.log('Getting books...');
    let bookEntries = await getBooks();

    // console.log('Writing entries to CSV');
    // const csv = new ObjectsToCsv(bookEntries);
    // await csv.toDisk('./open-library.csv');

    sqlPool.getConnection((err, connection) => {
      // catch err needed?

      const query = `INSERT INTO ex_book_test(ISBN, title, year_published, authorID, publisherID) VALUES (?, ?, ?, ?, ?)`;

      for (let entry of bookEntries) {
        // console.log(entry.isbn);
        const getAuthorQuery = `SELECT authorID from ex_author_test WHERE name="${entry.author}"`;
        const getPublisherQuery = `SELECT publisherID from ex_publisher_test WHERE name="${entry.publisher}"`;

        connection.query(getAuthorQuery, (err, result) => {
          // console.log(result);
          let authorID = result && result.length && result[0].authorID || null;
          // console.log(authorID);

          connection.query(getPublisherQuery, (err, result) => {
            let publisherID = result && result.length && result[0].publisherID || null;
            const { isbn, title, date_published } = entry;

            connection.query(query, [isbn, title, date_published, authorID, publisherID], function (err, result) {
              if (err) {
                console.error(err);
              } else {
                console.log('Successfully inserted', title);
              }
            });
          });
        });
      }

      connection.release();
    });

  } catch (err) {
    console.error(err);
  }
}


main();