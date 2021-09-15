var express = require('express');
var app = express();
var http = require('http');
var dotenv = require('dotenv');
var bodyParser=require('body-parser');
const path = require('path');
const cors=require('cors');
const connection=require('./dbconfig');
require('dotenv').config()

const port = process.env.PORT || 8080;
const server = http.createServer(app);
app.use(cors());
// app.use(bodyParser.json())
app.use(express.json());
const todo=require('./routes/todoApis');
const user = require('./routes/authApis');

app.use('/todo',todo);
app.use("/user",user);

server.listen(port,function(){
    console.log('listen to server .....',port);
});

