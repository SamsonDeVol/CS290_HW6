//Samson DeVol, HW6.js, 3-12-2021

var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host  : 'classmysql.engr.oregonstate.edu',
  user  : 'cs290_devols',
  password: '',
  database: 'cs290_devols'
});

module.exports.pool = pool;