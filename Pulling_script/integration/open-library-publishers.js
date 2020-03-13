const request = require('request-promise-native');
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
          // console.log(book);
          let entry = {
            publisher: book.publisher && book.publisher.length && book.publisher[0]
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

    publisherEntries = bookEntries.map(entry => entry.publisher);
    publisherUniqueEntries = [...new Set(publisherEntries)];

    // console.log('Writing entries to CSV');
    // const csv = new ObjectsToCsv(bookEntries);
    // await csv.toDisk('./open-library.csv');

    sqlPool.getConnection((err, connection) => {
      // catch err needed?

      const query = `INSERT INTO ex_publisher_test(name) VALUES (?)`;

      for (let entry of publisherUniqueEntries) {
        // Check for publisher names already in the DB
        const getPublisherQuery = `SELECT name from ex_publisher_test WHERE name="${entry}"`;
        connection.query(getPublisherQuery, (err, result) => {
          // if an publisher name is returned from the DB, this means it's a duplicate
          // Skip it
          let publisherName = result && result.length && result[0].name || null;
          // console.log(publisherName);
          if (entry === publisherName) {
            return;
          }

          // Add new publisher
          connection.query(query, [entry], function (err, result) {
            if (err) {
              console.error(err);
            } else {
              console.log('Successfully inserted', entry);
            }
          });


        });
      }

      connection.release();
    });

    // sqlPool.end();
  } catch (err) {
    console.error(err);
  }
}


main();