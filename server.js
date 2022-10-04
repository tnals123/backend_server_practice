const express = require("express")
const session = require('express-session')
const app = express() 

app.use(express.json()) // express에서 만든 json 해독기를 사용하겠다
//json 해독기를 먼저 사용한 후 -> api 등록을 해 주어야 한다.

const pagesApi = require("./router/pages")
const accountApi = require("./router/account")

//내가 따로 분리시킨 api 를 등록
app.use("/",pagesApi)
app.use("/",accountApi)

app.use(session({
    secret: '12345',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))


app.get("/confirmSession",(req,res)=>{
    if(req.session.user){
        res.send(req.session.user)
    }
    else{
    }
})



app.get('/logout', function (req, res, next) {

    if((req.session.user)) {  
        req.session.user = undefined
    }

    res.sendFile(__dirname + "/index.html")
})

app.get("/post/getData",(req,res) => {

    let connection = require('./database/maria')

    let loginResult = maria.selectData([],"postInfo")
    connection.query(loginResult,(err,result)=>{

        let postObject = {postList : []}

        for (let i = 0 ; i<result.length; i++){
            postObject.postList.push(result[i])
        }

        res.send(postObject)

    })

})

app.post("/post/getData/Detail",(req,res) => {

    let connection = require('./database/maria')

    const postNum = req.body.postNum

    let loginResult = maria.selectData(["postNum"],"postInfo")
    connection.query(loginResult,[postNum],(err,result)=>{

        console.log(result)

        let postObject = {postList : []}

        for (let i = 0 ; i<result.length; i++){
            postObject.postList.push(result[i])
        }

        res.send(postObject)

    })

})

app.post("/post/writePost/write",(req,res)=>{
    
    const idValue = req.body.idValue
    const postDate = req.body.postDate
    const postContents = req.body.postContents

    maria.insertData(["postUserId","postContents","postDATE"],
                     [idValue,postContents,postDate],"postInfo")

    let isSuccess = {
    "success" : true,
    }

    res.send(isSuccess)

})

app.delete("/post/delete",(req,res) => {

    const postNum = req.body.postNum

    maria.deleteData(["postNum"],[postNum],"postInfo")

    let isSuccess = {
        "success" : true,
    }

    res.send(isSuccess)

})

app.put("/post/update",(req,res) => {

    const newpostContents = req.body.newpostContents
    const postNum = req.body.postNum

    maria.updataData(["postContents"],["postNum"],[newpostContents,postNum],"postInfo")

    let isSuccess = {
        "success" : true,
    }

    res.send(isSuccess)

})




app.listen(3000, () => { 
    console.log ( "안녕" )})
