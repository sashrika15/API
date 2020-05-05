const express = require('express');
const mysql = require('mysql');
const router = express.Router();
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path')

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345',
    port: 3306,
    database: 'app'
})

connection.connect(function(err) {
    if(err) throw err;
    console.log('Connected as id ' + connection.threadId);
   
});

var query = 'CREATE TABLE IF NOT EXISTS users ( id int PRIMARY KEY, name varchar(255) UNIQUE )';

var q2 = 'CREATE TABLE IF NOT EXISTS user_data ( id int, date bigint, steps int, calories int )';

connection.query(query, (err,result) => {
    if (err) throw err;
});

connection.query(q2, (err,result) => {
    if (err) throw err;
});

//Routes 
const testFolder = './csv/';
router.post('/', (req, res) => {
fs.readdir(testFolder, (err, files) => {
    
   
    if(err) throw err;
  files.forEach(file => {
    var e = path.extname(file);
    console.log(e);
    if(e=='.csv') {
      //console.log(files);
      fs.createReadStream(testFolder + file)
        .on('error', (err) => {
            console.log(err);
        })
        .pipe(csv())
            .on('data', (row) => {
                var sql = `INSERT IGNORE INTO users VALUES ?`;
                var values = [[row.id,row.name]];
                var sql2 = 'INSERT IGNORE INTO user_data VALUES ?';
                var val = [[row.id, row.date, row.steps, row.calories]];
                // console.log(row);
                connection.query(sql, [values], (err, result) => {
                    if (err)  throw err;
                });
                connection.query(sql2, [val], (err, result) => {
                    if (err)  throw err;
                    
                });
        // console.log(file);
            })
            .on('end', () => {
                console.log("REached end of csv")
            });
        }
});
});
});

router.get('/', (req, res) => {

    connection.query('SELECT * from users', (err, rows, fields) => {
        if(err)
        console.log(err);
        else
        res.json(rows);
        
        
    });
    
});

router.get('/:id', (req, res) => {
    connection.query('SELECT name from users WHERE id = ?',[req.params.id], (err, rows, fields) => {
        if(err)
        console.log(err);
        else
        res.send(JSON.stringify(rows));
    })
});




module.exports = router;