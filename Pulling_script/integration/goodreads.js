const request = require('request-promise-native');

// import credentials
const { goodreads } = require('./config').credentials;

async function main() {
  // In ASCII, 'A' is 65 and 'Z' is 90
  for (let i = 65; i <= 90; i++) {
    try {
      let response = await request({
        uri: 'https://www.goodreads.com/search/index.xml',
        qs: {
          // Add extra alphabet letters to the query for more data
          q: String.fromCharCode(i),  // search query
          key: goodreads.key,
          secret: goodreads.secret,
          search: 'title'
        }
      });

      console.log(response);

    } catch (err) {
      console.error(err);
    }
  }
}

main();