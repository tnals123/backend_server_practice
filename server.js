const express = require("express")
const session = require('express-session')
const bodyParser = require('body-parser');
const multer = require('multer');
var schedule = require("node-schedule");
var cookieParser = require('cookie-parser'); 
const client = require('./config/database')
let redis = require('./modules/redisController')();
const app = express() 
app.use(express.urlencoded({    
    limit:"50mb",
    extended: false
}));
app.use(express.json({   
 limit : "50mb"
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser('SEXY'));

app.use(express.json()) // express에서 만든 json 해독기를 사용하겠다
//json 해독기를 먼저 사용한 후 -> api 등록을 해 주어야 한다.
const path = require('path')
const fs = require("fs")
const https = require("https")

const options = {
    "key" : fs.readFileSync(path.join(__dirname, "/ssl/key.pem")),
    "cert" : fs.readFileSync(path.join(__dirname, "/ssl/cert.pem")),
    "passphrase" : "1234"
}

app.get("*",(req,res,next) => {

    const protocol = req.protocol

    if (protocol == "https"){
        next()
    }
    else{
        const des = "https://" + req.hostname + ":3443" + req.url
        console.log("리디렉트")
        res.redirect(des)
    }

})

const pagesApi = require("./router/pages")
const accountApi = require("./router/account")
const postApi = require("./router/post")
const mongoApi = require("./router/mongoDB")
const commentApi = require("./router/comments")
const clickerApi = require("./router/clicker")
const cartApi = require("./router/cart")
const searchLogApi = require("./router/searchLog")


//내가 따로 분리시킨 api 를 등록
app.use(session({
    secret: '12345',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}))

app.use("/",pagesApi)
app.use("/",accountApi)
app.use("/",postApi)
app.use("/",commentApi)
app.use("/",mongoApi)
app.use("/searchLog",searchLogApi)
app.use("/clicker",clickerApi)
app.use("/cart",cartApi)

app.listen(3000,'0.0.0.0', () => { 
    console.log ( "안녕" )})

https.createServer(options,app).listen(3443,'0.0.0.0', () => { 
    console.log ( "안녕2" )

    schedule.scheduleJob('10 * * * * *', function() {

        let loginCount = 0
        let sql = "UPDATE backend.account SET loginCount = loginCount + $1"

        redis.initLoginCount((data) => {
            console.log(data)
        })
    
        redis.getLoginCount((data) => {
            loginCount = parseInt(data.messege)

            client.query(sql,[loginCount], (err,data) => {
                console.log(loginCount)
                if (err){
                    console.log(err)
                }
            })
        })
    
        console.log("매 10초에 한번씩 실행됩니다.");
    });

})