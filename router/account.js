const account = require('express').Router()
const client = require('../config/database')

account.get("/session",(req,res)=>{
    console.log("api시작!")
    if(req.session.user){
        console.log("세션 존재")
        console.log(req.session.user)
        res.send(req.session.user)
    }
    else{
        console.log("세션존재안함")
        res.send({})
    }
})

account.post("/account/idCheck",(req,res) => {

    console.log(session)

    const idValue = req.body.id

    const sql = "SELECT * FROM backend.userInfo WHERE userId = $1"
    const values = [idValue]

    client.query(sql,values, (err,data) => {

        let result = {
            "success" : false,
        }

        const row = data.rows
        if (row.length != 0){
            //아이디가 이미 존재
            result.success = true
            res.send(result)
        }
        else{
            //아이디가 존재하지 않음
            result.success = false
            res.send(result)
        }

    })
})

account.post("/account/resister",(req,res)=>{

    const idValue = req.body.idValue
    const pwValue = req.body.pwValue
    const userPhoneNumber = req.body.userPhoneNumber
    const userNickName = req.body.userNickName

    const sql = "INSERT INTO backend.userInfo (userId,userPw,userPhoneNumber,userNickName) VALUES ($1,$2,$3,$4) "
    const values =[idValue,pwValue,userPhoneNumber,userNickName]

    client.query(sql,values,(err,data) => {
        
        let result = {
            success : false
        }

        if (err) {
            console.log(err)
            result.success = false
            res.send(result)
            return
        }
        else{
            result.success = true
            res.send(result)
        }
    })
    
})

account.post("/account/login", (req,res)=>{

    const idValue = req.body.id
    const pwValue = req.body.pw

    const sql = "SELECT * FROM backend.userInfo WHERE userId = $1 AND userPw = $2"
    const values = [idValue,pwValue]

    client.query(sql,values, (err,data) => {

        let result = {
            "success" : true,
        }

        const row = data.rows
        if (row.length != 0){
            result.success = true
            console.log("로그인 성공")
            
            req.session.user = {
                userId : idValue,
                userPw : pwValue
            }
            console.log("세션 삽입")

            res.send(result)
        }
        else{
            result.success = false
            res.send(result)
        }
    })
})

module.exports = account
