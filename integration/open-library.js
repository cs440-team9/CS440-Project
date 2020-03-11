const request = require('request-promise-native');

// import credentials
// const { openlibrary } = require('./config').credentials;

const bookEntries = [];

async function getBooks() {
  // In ASCII, 'A' is 65 and 'Z' is 90
  for (let i = 65; i <= 90; i++) {
    try {
      let response = await request({
        uri: 'http://openlibrary.org/search.json',
        qs: {
          // Add extra alphabet letters to the query for more data
          title: String.fromCharCode(i) + 'a',  // search query
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
            author_name: book.author_name && book.author_name,
            publish_date: book.publish_date && book.publish_date[0],
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

  console.log(JSON.stringify(bookEntries));
}

getBooks();