const express = require('express');
const mysql = require('mysql');
const router = express.Router();
const fs = require('fs');
const csv = require('csv-parser');

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

//Routes 

router.get('/', (req, res) => {

    connection.query('SELECT * from user1', (err, rows, fields) => {
        if(err)
        console.log(err);
        else{
        res.json(rows);
        
        }
    });
    
});

router.get('/:id', (req, res) => {
    connection.query('SELECT name from user1 WHERE id = ?',[req.params.id], (err, rows, fields) => {
        if(err)
        console.log(err);
        else
        res.send(JSON.stringify(rows));
    })
});

fs.createReadStream('data.csv').pipe(csv())
  .on('data', (row) => {
    var sql = `INSERT INTO user1 VALUES ?`;
    var values = [[row.id,row.name, row.date, row.steps, row.calories]];
    //console.log(values);
    connection.query(sql, [values], (err, result) => {
        if (err) console.log(err);

    });
    //console.log(sql);
  });
  
module.exports = router;
