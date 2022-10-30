const express = require("express")
const session = require('express-session')
const app = express() 

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


//내가 따로 분리시킨 api 를 등록
app.use(session({
    secret: '12345',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))

app.use("/",pagesApi)
app.use("/",accountApi)
app.use("/",postApi)
app.use("/",commentApi)
app.use("/",mongoApi)

app.listen(3000,'0.0.0.0', () => { 
    console.log ( "안녕" )})

https.createServer(options,app).listen(3443,'0.0.0.0', () => { 
    console.log ( "안녕2" )})