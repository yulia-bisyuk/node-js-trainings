// const mysql = require('mysql2');

// const pool = mysql.createPool({
//   host: 'localhost',
//   user: 'root',
//   database: 'node-complete',
//   password: '091949SQL',
// });

// module.exports = pool.promise();

//using Sequelize

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('node-complete', 'root', '091949SQL', {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = sequelize;
