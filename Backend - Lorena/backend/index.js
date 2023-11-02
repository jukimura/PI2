const express = require("express");
const app = express();
const port = 3000;
const router = require("./routers/index");

router(app);

app.listen(port, (error) => {
    if(error) {
        console.log("erro, tente novamente");
        return;
    }
    console.log("funcionou")
});

const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'us-cdbr-east-06.cleardb.net', 
  user: 'b14593427ed7b4', 
  password: 'd00426b1', 
  database: 'heroku_e7d7e8084813ca0' 
});

connection.connect((err) => {
  if (err) {
    console.error('deu ruim', err);
    return;
  }
  console.log('boa');
});

module.exports = connection;

// mysql://b14593427ed7b4:d00426b1@us-cdbr-east-06.cleardb.net/heroku_e7d7e8084813ca0?reconnect=true