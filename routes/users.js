const Bluebird = require('bluebird');
const express = require('express');
const mysql = require('mysql');
const router = express.Router();
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const testFolder = './csv/';
Bluebird.promisifyAll(fs);

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345',
    port: 3306,
    database: 'app'
});

db  = Bluebird.promisifyAll(connection);

connection.connect(err => {
    if(err) throw err;
    console.log('Connected as id ' + connection.threadId);
   
});

//Functions for modularity 

var all_files = [];

//Checks if file is csv for each file in array
function checkCSV(files) {
    return new Promise((resolve,reject) => {
        files.forEach(file => {
            var e = path.extname(file);
            if(e=='.csv')
            all_files.push(file);
            resolve(all_files);
        })
    })
};

var q1 = 'CREATE TABLE IF NOT EXISTS users ( id int PRIMARY KEY, name varchar(255) )';
var q2 = 'CREATE TABLE IF NOT EXISTS user_data ( id int, date bigint, steps int, calories int )';

db.queryAsync(q1)
.then(db.queryAsync(q2))
.catch(err => console.log(err));

//Routes

//Post request to enter data in tables
router.post('/', (req,res) => {
    fs.readdirAsync(testFolder)
    .then((values) => { return checkCSV(values) })
    .then((file) => {
        for (i=0; i<file.length; i++)
        {
            fs.createReadStream(testFolder + file[i])
            .on('error', (err) => console.log(err))
            .pipe(csv())
            .on('data', (row) => {
                var sql1 = `INSERT IGNORE INTO users VALUES ?`;
                var sql2 = 'INSERT IGNORE INTO user_data VALUES ?';
                db.queryAsync(sql1,[[[row.id, row.name]]])
                .then(db.queryAsync(sql2, [[[row.id, row.date, row.steps, row.calories]]]))
                .catch(err => console.log(err))
                })
            .on('end', () => console.log("Reached end of csv"));
            }
        })
    .then(res.json("Success"))
    .catch(err => console.log(err));
});

//Get request for all data in users
router.get('/', (req, res) => {
    db.queryAsync('SELECT * from users')
    .then((rows) => res.json(rows))
    .catch(err => console.log(err))
});

//Get request for specific ID
router.get('/:id', (req, res) => {
    var query = 'SELECT * from users JOIN user_data WHERE users.id = ? \
    AND user_data.id = ? ORDER BY user_data.date'
    db.queryAsync(query,[req.params.id, req.params.id])
    .then(rows => res.json(rows))
    .catch(err => console.log(err))
});

module.exports = router;