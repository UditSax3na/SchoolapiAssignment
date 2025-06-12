const MYSQLCON = require('mysql2');

const conn = MYSQLCON.createConnection({
    host:process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DBNAME
})

conn.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
  } else {
    console.log('Connected to the MySQL database');
  }
});

module.exports = conn;