const express = require("express")
const session = require('express-session')
const app = express() 

app.use(express.json()) // express에서 만든 json 해독기를 사용하겠다
//json 해독기를 먼저 사용한 후 -> api 등록을 해 주어야 한다.

const pagesApi = require("./router/pages")
const accountApi = require("./router/account")
const postApi = require("./router/post")

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

app.get('/logout', function (req, res, next) {

    if((req.session.user)) {  
        req.session.user = undefined
    }

    res.sendFile(__dirname + "/index.html")
})





app.listen(3000, () => { 
    console.log ( "안녕" )})
