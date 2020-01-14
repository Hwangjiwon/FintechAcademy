var mysql = require('mysql');
var request = require('request');
var express = require('express');
var cors = require('cors');
var app = express();
var port = 3000
var bodyParser = require('body-parser');

var jwt = require('jsonwebtoken');
var tokenKey = "Invest1011!2@3#4$5%"
var auth = require("./lib/auth");

app.use(cors());
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'sujung05',
    database: 'fintech',
    port: '3306'
});
connection.connect();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//get
//test code
app.get('/db2front', function (req, res) {
    connection.query('SELECT * FROM invest101.user', function (error, results, fields) {
        if (error) throw error;
        console.log('The result is: ', results);
        res.json(results);
    });
})

app.get('/', function (req, res) {
    res.render('index');
})

app.get('/login', function (req, res) {
    res.render('login');
})

app.get('/login_main', function (req, res) {
    //res.render('login_main',{data : results});
    res.render('login_main');
})

app.get('/getMainData', function (req, res) {
    connection.query('SELECT * FROM invest101.trainee', function (error, results, fields) {
        if (error) throw error;
        console.log('The result is: ', results);
        res.json(results);
    });
})

app.get('/moneyData', function (req, res) {
    connection.query('SELECT * FROM invest101.donation', function (error, results, fields) {
        if (error) throw error;
        console.log('The result is: ', results);
        res.json(results);
    });
})

app.get('/sumAll', function (req, res) {
    connection.query('SELECT sum(money) as sumall FROM invest101.donation', function (error, results, fields) {
        if (error) throw error;
        console.log('The result is: ', results);
        res.json(results);
    });
})

app.get('/signUp', function (req, res) {
    res.render('signUp');
})

app.get('/authResult', function (req, res) {
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
            redirect_uri: "http://192.168.20.17:3000/authResult",
            grant_type: "authorization_code"
        }
    }

    request(option, function (error, response, body) {
        console.log(body);
        var accessRequestResult = JSON.parse(body);
        res.render('resultChild', { data: accessRequestResult });
    });
})

app.get('/trainee', function (req, res) {
    res.render('trainee');
})

app.get('/support', function (req, res) {
    var traineeId = req.body.traineeId;
    res.render('support');
})

app.get('/mypage', function (req, res) {
    res.render('mypage');
})



// post
app.post("/user", function (req, res) {
    console.log(req.body);
})

app.post("/signUp", function (req, res) {
    console.log(req.body);
    var email = req.body.email;
    var password = req.body.password;
    var accessToken = req.body.accessToken;
    var refreshToken = req.body.refreshToken;
    var userseqnum = req.body.userseqnum;

    console.log(accessToken, "에세스 토큰 확인")
    console.log(refreshToken, "재인증 토큰 확인")
    console.log(userseqnum, "UserSeqNum")
    // 3개 변수 추가

    var sql = "INSERT INTO invest101.user (email, password, accesstoken, refreshtoken, userseqnum) VALUES (?, ?, ?, ?, ?)"
    // SQL 구문 변경 DB 구조 확인 바람

    connection.query(sql, [email, password, accessToken, refreshToken, userseqnum], function (error, results, fields) {
        // [] 배열 정보 변경 -> 변수추가
        if (error) throw error;
        console.log('The result is: ', results);
        console.log('sql is ', this.sql);
        res.json(1);
    });
});

app.post("/login", function (req, res) {

    var email = req.body.email;
    var userPassword = req.body.password;
    var sql = 'SELECT * FROM invest101.user WHERE email = ?';
    console.log(email);

    connection.query(sql, [email], function (error, results, fields) {
        if (error) throw error;
        console.log("*****id:" + results[0].id);
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

app.post('/supportMoney', function (req, res) {
    var traineeId = req.body.traineeId;
    var sql = "SELECT sum(money) as support FROM invest101.donation WHERE id = ?";
    connection.query(sql, [traineeId],function (error, results, fields) {
        if (error) throw error;
        res.json(results);
    });
})

app.post('/support', function (req, res) {
    var traineeId = req.body.traineeId;
    console.log('아이디는: ' + traineeId);
    
})

app.post('/supportPeople', function (req, res) {
    var traineeId = req.body.traineeId;
    var sql = "SELECT count(*) as people FROM invest101.donation WHERE trainee_id = ?";
    connection.query(sql, [traineeId],function (error, results, fields) {
        if (error) throw error;
        res.json(results);
    });
})


app.listen(port, function (req, res) {
    console.log('server start! port: ' + port)
})
