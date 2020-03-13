This portion of the project involves pulling a massive amount of data from external APIs, process them, and integrate only the necessary parts into MariaDB.


## Progress Log

### Open Library API

- Reimplement books import script to insert data with author and publisher IDs, not names (relationality)
- Implement scripts to import authors and publishers separately
- Add bash script to automate adding a letter to search queries
- Also for queries 'ab' to 'zb'
- Retrieved and integrated books from Open Library API with queries from 'a' to 'z', and 'aa' to 'za'.


## Execution

For best results, ensure you have Node v12 or higher. (v10 may work, but use at your own risk).

To write API data and errors to files, run:

``` bash
node open-library.js >> output.txt 2>> error.txt
```

Replace `open-library.js` with the name of the respective API.

## `config.js`

A file named `config.js` is used to store all API credentials. However, since I'm not comfortable pushing sensitive info to a public repo, a template file named `template-config.js` takes its place. It is almost the same as the source `config.js`, but with all the credentials removed.

Create your own `config.js` (with your own credentials) from this template file to run the programs.

## How to Formulate Search Queries

Search queries to get all possible matches of books by name is done with a for loop that goes through letters A to Z. Then, to get more data, additional letters to the query.

It is currently pretty primitive in that one has to manually add letters to the query. I'm hoping to implement some recursion formula that tries out every possible permutation of letters for a string of length *n* so we can get data faster.
