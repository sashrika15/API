const express = require('express');
const mysql = require('mysql');
const router = express.Router();
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path')
const testFolder = './csv/';
//const promise = require('promise');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345',
    port: 3306,
    database: 'app'
})

connection.connect(err => {
    if(err) throw err;
    console.log('Connected as id ' + connection.threadId);
   
});

var q1 = 'CREATE TABLE IF NOT EXISTS users ( id int PRIMARY KEY, name varchar(255) )';
var q2 = 'CREATE TABLE IF NOT EXISTS user_data ( id int, date bigint, steps int, calories int )';

connection.query(q1, (err,result) => {
    if (err) throw err;
});

connection.query(q2, (err,result) => {
    if (err) throw err;
});

function read(testFolder) {
    return new Promise((resolve,reject) => {
        fs.readdir(testFolder, (err, files) => {
           resolve(files);
            })
        })
    }

var all_files = [];

function checkCSV(files) {
    return new Promise((resolve,reject) => {
        files.forEach(file => {
            var e = path.extname(file);
            if(e=='.csv')
            all_files.push(file);
            resolve(all_files);
        })
    })
}


function sql_insert(query,data) {
    return new Promise((resolve,reject) => {
        connection.query(query, [data], (err, result) => {
            if (err)  throw reject(err);
            resolve();
        });
    })
}

//Routes

router.post('/', (req,res) => {
    read(testFolder)
    .then((values) => {
        checkCSV(values)
        .then((file) => {
           for (i=0; i<file.length; i++)
           {
           fs.createReadStream(testFolder + file[i])
                .on('error', (err) => console.log(err))
                .pipe(csv())
                .on('data', (row) => {
                    var sql1 = `INSERT IGNORE INTO users VALUES ?`;
                    var sql2 = 'INSERT IGNORE INTO user_data VALUES ?';
                    sql_insert(sql1, [[row.id, row.name]])
                    .then(sql_insert(sql2, [[row.id, row.date, row.steps, row.calories]]))
                    .catch(err => console.log(err)) 
                })
                .on('end', () => {
                    console.log("Reached end of csv")
                });
            }
        })
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err));
})

function sql_query(query , data) {
    return new Promise((resolve,reject) => {
        connection.query(query, data, (err, rows) => {
            resolve(rows);
            if(err) reject(err);
        })
    })
}

router.get('/', (req, res) => {
    sql_query('SELECT * from users')
    .then((rows) => res.json(rows))
    .catch(err => console.log(err))
});


router.get('/:id', (req, res) => {
    var query = 'SELECT * from users JOIN user_data WHERE users.id = ? \
    AND user_data.id = ? ORDER BY user_data.date'
    sql_query(query,[req.params.id, req.params.id])
    .then(rows => res.json(rows))
    .catch(err => console.log(err))
});



module.exports = router;