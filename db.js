const mysql = require('mysql2');

// Create a connection pool
const pool = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DBNAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Optional: ping the pool to confirm it works
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to the MySQL database:', err.message);
    } else {
        console.log('Connected to the MySQL database');
        connection.release();
    }
});

module.exports = pool;