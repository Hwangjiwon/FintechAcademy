var express = require("express");
var jwt = require('jsonwebtoken');
var request = require('request');
var tokenKey = "fintechAcademy1!2@3#4$5%"
var auth = require("./lib/auth");

app = express();
var port = process.env.PORT || 3000;
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'sujung05',
    database: 'fintech',
    port: '3306'
});

connection.connect();

app.get("/testAuth", auth, function (req, res) {
    res.json("로그인 된 사용자 입니다.");
})

app.get('/test', function (req, res) {
    res.render('test');
})

app.get('/', function (req, res) {
    res.render('home');
})

app.get('/index', function (req, res) {
    res.render('index');
})

app.get('/db2front', function (req, res) {
    connection.query('SELECT * FROM test', function (error, results, fields) {
        if (error) throw error;
        console.log('The result is: ', results);
        res.json(results);
    });
})

app.get("/login", function (req, res) {
    res.render('login');
});


app.get("/signUp", function (req, res) {
    res.render('signUp');
});

app.get("/authResult", function (req, res) {
    var authCode = req.query.code;
    console.log(authCode);
    var option = {
        method: "POST",
        url: " https://testapi.openbanking.or.kr/oauth/2.0/token",
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
});

app.post("/user", function (req, res) {
    console.log(req.body);
    var name = req.body.name;
    var password = req.body.password;
    var email = req.body.email;
    var accessToken = req.body.accessToken;
    var refreshToken = req.body.refreshToken;
    var userSeqNo = req.body.userSeqNo;

    console.log(accessToken, "에세스 토큰 확인")
    console.log(refreshToken)
    // 3개 변수 추가

    var sql = "INSERT INTO fintech.user (name, email, password, accesstoken, refreshtoken, userseqno) VALUES (?, ?, ?, ?, ?, ?)"
    // SQL 구문 변경 DB 구조 확인 바람

    connection.query(sql, [name, email, password, accessToken, refreshToken, userSeqNo], function (error, results, fields) {
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
    var sql = 'SELECT * FROM user WHERE email = ?';

    connection.query(sql, [email], function (error, results, fields) {
        if (error) throw error;
        console.log(results[0].password, userPassword);
        if (results[0].password == userPassword) {
            jwt.sign(
                {
                    userName: results[0].name,
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

app.post('/accountList', auth, function (req, res) {
    var userData = req.decoded;
    var sql = "SELECT * FROM user WHERE id = ?"
    connection.query(sql, [userData.userId], function (err, result) {
        if (err) {
            console.error(err);
            throw err;
        }
        else {
            var option = {
                method: "get",
                url: "https://testapi.openbanking.or.kr/v2.0/account/list",
                headers: {
                    "Authorization": "Bearer " + result[0].accesstoken
                },
                qs: {
                    'user_seq_no': result[0].userseqno,
                    'include_cancel_yn': 'Y',
                    'sort_order': 'D'
                }
            }
            request(option, function (error, response, body) {
                console.log(body);
                var parseData = JSON.parse(body);
                res.json(parseData);
            })
        }
    })
})
app.post('/balance', auth, function (req, res) {
    var userData = req.decoded;
    var sql = "SELECT * FROM user WHERE id = ?"
    connection.query(seq, [userData.userID], function (req, res) {
        if (err) {
            console.error(err);
            throw err;
        }
        else {
            console.log(result);
            var option = {
                method : "get",
                url : "https://testapi.openbanking.or.kr/v2.0/account/balance/fin_num",
                headers : {
                    "Authorization" : "Bearer " + result[0].accesstoken
                },
                qs : {
                    bank_tran_id: 'T991599190U000000004',
                    fintech_use_num: '?',
                    tran_dtime: '20200108145630'
                }
            } 
            request(option, function(error,response, body){
                console.log(body);
                var parseData = JSON.parse(body);
                res.json(parseData);
            })                    
        }
    })
})

app.listen(port);
console.log("Listening on port ", port);
