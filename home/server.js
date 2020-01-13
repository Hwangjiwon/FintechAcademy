var mysql      = require('mysql');
const request = require('request')
const express = require('express')
const app = express()
const port = 3000
var bodyParser = require('body-parser')

var jwt = require('jsonwebtoken');
var tokenKey = "home1!2@3#4$5%"
var auth = require("./lib/auth");


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

app.listen(port, function(req,res){
    console.log('server start! port: ' + port)
})

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'sujung05',
  database : 'fintech',
  port : '3306'
});

connection.connect();

//get
//test code
app.get('/db2front', function (req, res) {
    connection.query('SELECT * FROM fintech.home_user', function (error, results, fields) {
        if (error) throw error;
        console.log('The result is: ', results);
        res.json(results);
    });
})


app.get('/', function (req, res) {
  res.render('index')
})

app.get('/login_main', function (req, res) {
    res.render('login_main')
  })
  
app.get('/authResult', function(req,res){
    var authCode = req.query.code;
    console.log(req.query);

    var option = {
        method: "POST",
        url: "https://testapi.openbanking.or.kr/oauth/2.0/token",
        headers: "",
        form: {
            code: authCode,
            client_id: "Ty5sILRLOLNnCm67y4sf4k5NrB7t6VT182AfdR2z",
            client_secret: "nQlGdi10nJZ4XB5MoQSH4rwc9peCR1z4mmsmGjvY",
            redirect_uri: "http://localhost:3000/authResult",
            grant_type: "authorization_code"
        }
    }

    request(option, function (error, response, body) {
        console.log(body);
        var accessRequestResult = JSON.parse(body);
        res.render('resultChild', { data: accessRequestResult });
    });
})



// post
app.post("/signUp", function (req, res) {
    console.log(req.body);
    var email = req.body.email;
    var password = req.body.password;

    var sql = "INSERT INTO `fintech`.`home_user` (`email`, `password`) VALUES (?, ?)";

    connection.query(sql, [email, password], function (error, results, fields) {
        if (error) throw error;
        console.log('The result is: ', results);
        console.log('sql is ', this.sql);
        res.json(1);
    });
});

app.post("/login", function (req, res) {
    var email = req.body.email;
    var userPassword = req.body.password;
    var sql = 'SELECT * FROM `fintech`.`home_user` WHERE email = ?';

    connection.query(sql, [email], function (error, results, fields) {
        if (error) throw error;
        console.log(results[0].password, userPassword);
        if (results[0].password == userPassword) {
            jwt.sign(
                {
                    userId: results[0].id,
                    userEmail: results[0].email
                },
                tokenKey,
                {
                    expiresIn: '10d',
                    issuer: 'fintech.admin',
                    subject: 'user.login.info'
                },
                function (err, token) {
                    console.log('로그인 성공', token)
                    res.json(token)
                }
            )
        }
        else {
            console.log('비밀번호 틀렸습니다.');
            res.json(0);
        }
    })
});

