var mysql = require('mysql');
// Set database connection credentials and create a MySQL pool
var pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'classmysql.engr.oregonstate.edu',
    user            : 'cs440_group09',
    password        : 'tHAjRjkkPz5K',
    database        : 'cs440_group09'
});

// Export the pool
module.exports.pool = pool;
