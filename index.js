var express = require("express");
var mysql = require('mysql');
var app = express();

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '*******',
    database: 'app'
})

connection.connect(function(err) {
    if(err) 
    console.log(err);

    console.log('Connected as id ' + connection.threadId);
   
});

app.get('/users', (res, req) => {
    connection.query('SELECT * from users', (err, rows, fields) => {
        if(err)
        console.log(err);
        else
        console.log(JSON.stringify(rows));
    })
});

app.listen(3000, () => {
 console.log("Server running on port 3000");
});
