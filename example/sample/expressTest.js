const express = require('express');
const app = express();

app.get('/', function(req,res){
    res.send("hello world")
})

app.get('/router', function(req,res){
    res.send("hello router")
})

app.listen(3000)