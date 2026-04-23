const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'world'
});

db.connect(err => {
    if (err) {
        console.error('DB connection failed:', err);
        return;
    } else {
        console.log('Connected to MySQL database');
    }
});

module.exports = db;