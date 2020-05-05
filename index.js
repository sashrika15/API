const express = require("express");
const app = express();
const bodyparser = require('body-parser');


app.use(bodyparser.json());
//Importing routes
const usersRoute = require('./routes/users');

app.get('/', (req,res) => {
    res.send("Go to localhost:3000/users for user data. \
        You can query user data with localhost:3000/users/id");
});

app.use('/users', usersRoute);

app.listen(3000, () => {
 console.log("Server running on port 3000");
});
