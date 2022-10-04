const account = require('express').Router()
const client = require('../config/database')

// //server.js 에서 봤을 때,회원정보 받기

// account.get("/",(req,res) => {

// })

// //server.js 에서 봤을 때,회원가입

// account.post("/",(req,res)=> {

// })

// //server.js 에서 봤을 때,로그인

// account.post("/login",(req,res) => {

// })

account.post("/account/idCheck",(req,res) => {

    const idValue = req.body.id

    const sql = "SELECT * FROM backend.userInfo WHERE userId = $1"
    const values = [idValue]

    client.query(sql,values, (err,data) => {

        let isSuccess = {
            "success" : false,
        }

        if (err) {
            console.log(err)
            res.send(isSuccess)
            return
        }

        else{
            const row = data.rows
            if (row.length != 0){
                //아이디가 이미 존재
                isSuccess.success = true
                res.send(isSuccess)
            }
            else{
                //아이디가 존재하지 않음
                isSuccess.success = false
                res.send(isSuccess)
            }
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
        
        let isSuccess = {
            success : false
        }

        if (err) {
            console.log(err)
            isSuccess.success = false
            res.send(isSuccess)
            return
        }
        else{
            isSuccess.success = true
            res.send(isSuccess)
        }
    })
    
})

account.post("/account/login", (req,res)=>{

    const idValue = req.body.id
    const pwValue = req.body.pw

    client.connect((err) => {
        if (err) {
            console.log(err)
            res.send(err)
            return
        }

    })

    const sql = "SELECT * FROM backend.userInfo WHERE userId = $1 AND userPw = $2"
    const values = [idValue,pwValue]

    client.query(sql,values, (err,data) => {

        let isSuccess = {
            "success" : true,
        }

        if (err) {
            console.log(err)
            res.send(isSuccess)
            return
        }

        else{
            const row = data.rows
            if (row.length != 0){
                isSuccess.success = true
                res.send(isSuccess)
            }
            else{
                isSuccess.success = false
                res.send(isSuccess)
            }
        }
    })
})

module.exports = account
