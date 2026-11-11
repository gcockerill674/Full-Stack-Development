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
        'SELECT id, name, address FROM customers.customers',
        function(err, results) {
            if (err) {
                console.log("Error selecting customers:");
                console.log(err);
                con.end();
                return;
            }

            console.log("Customers:");
            console.log(results);
            con.end();
        }
    );
});