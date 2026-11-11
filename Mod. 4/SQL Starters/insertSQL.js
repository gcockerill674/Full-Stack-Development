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
        'INSERT INTO `registration-system`.students (name, address) VALUES (?, ?)',
        ['Gregory Cockerill', 'Crete'],
        function(err, result) {
            if (err) {
                console.log("Error inserting data:");
                console.log(err);
                con.end();
                return;
            }
            console.log(`${result.affectedRows} customer inserted.`);
            con.end();
        }
    );

});