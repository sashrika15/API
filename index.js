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
    if(err) 
    console.log(err);

    console.log('Connected as id ' + connection.threadId);
   
});

app.get('/users', (req, res) => {
    connection.query('SELECT * from users', (err, rows, fields) => {
        if(err)
        console.log(err);
        else
        res.send(JSON.stringify(rows));
    })
});

app.get('/users/:id', (req, res) => {
    connection.query('SELECT name from users WHERE id = ?',[req.params.id], (err, rows, fields) => {
        if(err)
        console.log(err);
        else
        res.send(JSON.stringify(rows));
    })
});

app.listen(3000, () => {
 console.log("Server running on port 3000");
});
