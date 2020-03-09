var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'classmysql.engr.oregonstate.edu',
    user            : 'cs440_group09',
    password        : 'tHAjRjkkPz5K',
    database        : 'cs440_group09'
});

module.exports.pool = pool;