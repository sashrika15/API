const express = require("express");
const app = express();

//Importint routes
const usersRoute = require('./routes/users');

app.use('/users', usersRoute);

app.listen(3000, () => {
 console.log("Server running on port 3000");
});
