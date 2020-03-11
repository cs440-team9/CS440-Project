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
          title: String.fromCharCode(i),  // search query
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
            date_published: book.publish_date && book.publish_date[0],
            publisher: book.publisher && book.publisher[0]
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


async function insertBookToDB(entry) {
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

      const query = `INSERT INTO Book(ISBN, Title, Date_published, Author, Publisher) VALUES (?, ?, ?, ?, ?)`;

      for (let entry of bookEntries) {

        const { isbn, title, date_published, author, publisher } = entry;
        connection.query(query, [isbn, title, date_published, author, publisher], function (err, rows, fields) {
          if (err) {
            console.error(err);
          } else {
            console.log('Successfully inserted', title);
          }
        });

      }
      connection.release();
      sqlPool.end();
    });

  } catch (err) {
    console.error(err);
  }
}


main();