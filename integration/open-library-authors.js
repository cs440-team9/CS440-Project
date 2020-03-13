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
          let entry = {
            author: book.author_name && book.author_name[0]
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

    authorEntries = bookEntries.map(entry => entry.author);
    authorUniqueEntries = [...new Set(authorEntries)];

    // console.log('Writing entries to CSV');
    // const csv = new ObjectsToCsv(bookEntries);
    // await csv.toDisk('./open-library.csv');

    sqlPool.getConnection((err, connection) => {
      // catch err needed?

      const query = `INSERT INTO ex_author_test(name) VALUES (?)`;

      for (let entry of authorUniqueEntries) {
        // Check for author names already in the DB
        const getAuthorQuery = `SELECT name from ex_author_test WHERE name="${entry}"`;
        connection.query(getAuthorQuery, (err, result) => {
          // if an author name is returned from the DB, this means it's a duplicate
          // Skip it
          let authorName = result && result.length && result[0].name || null;
          // console.log(authorName);
          if (entry === authorName) {
            return;
          }

          // Add new author
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