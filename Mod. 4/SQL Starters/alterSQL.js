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

    con.query('ALTER DATABASE IF NOT EXISTS `registration-system`', function(err) {
        if (err) {
            console.log("Error creating database:");
            console.log(err);
            con.end();
            return;
        }

        con.query(
            'ALTER TABLE `registration-system`.students RENAME COLUMN id TO student_id',
            function(err) {
                if (err) {
                    console.log("Error altering table:");
                    console.log(err);
                    con.end();
                    return;
                }
                console.log("Table altered.");
                con.end();
            }
        );
    });
});
