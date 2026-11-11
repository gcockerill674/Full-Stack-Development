const mysql = require('mysql2');

const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'ThisIsRequired123',
    port: 3306,
});

con.connect(function(err) {
    if (err) {
        console.log("Connection failed:");
        console.log(err);
        return;
    }

    con.query('CREATE DATABASE `registration-system`', function(err, result) {
        if (err) {
            console.log("Error creating database:");
            console.log(err);
            return;
        }
        console.log("Database created.");
    });
});
