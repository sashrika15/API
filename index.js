var express = require("express");
var mysql = require('mysql');
var app = express();

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Vimmi@rani07',
    database: 'app'
})

connection.connect(function(err) {
    if(err) throw err;

    console.log('connected as id ' + connection.threadId);
    connection.query('select * from users;', function(err, result){
        if (err) throw err;
        console.log(result);

    });
});

app.listen(3000, () => {
 console.log("Server running on port 3000");
});