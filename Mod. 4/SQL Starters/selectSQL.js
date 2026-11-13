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

    con.query(
        'SELECT `student_id`, `first-name`, `last-name`, `email` FROM `registration-system`.students',
        function(err, results) {
            if (err) {
                console.log("Error selecting students:");
                console.log(err);
                con.end();
                return;
            }

            console.log("Students:");
            console.log(results);
            con.end();
        }
    );
});