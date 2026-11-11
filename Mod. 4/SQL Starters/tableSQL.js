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

    con.query('CREATE DATABASE IF NOT EXISTS `registration-system`', function(err) {
        if (err) {
            console.log("Error creating database:");
            console.log(err);
            con.end();
            return;
        }

        con.query(
            'CREATE TABLE IF NOT EXISTS `registration-system`.students (id INT AUTO_INCREMENT PRIMARY KEY, `first-name` VARCHAR(255), `last-name` VARCHAR(255), `email` VARCHAR(255))',
            function(err) {
                if (err) {
                    console.log("Error creating table:");
                    console.log(err);
                    con.end();
                    return;
                }
                console.log("Table created.");
                con.end();
            }
        );
    });
});
