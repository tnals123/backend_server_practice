const account = require('express').Router()
const client = require('../config/database')
var requestIp = require('request-ip');
let mongo = require('../modules/mongoController')();
let accountForm = require('../modules/signUpController')();

account.get("/session",(req,res)=>{
    if(req.session.user){
        res.send(req.session.user)
        mongo.insertLogging(requestIp.getClientIp(req),req.session.user.userId,"/session",{},req.session.user,new Date())
    }
    else{
        res.send({})
        mongo.insertLogging(requestIp.getClientIp(req),"None","/session",{},{},new Date())
    }
})

account.post("/account/idCheck",(req,res) => {

    const idValue = req.body.id

    const sql = "SELECT * FROM backend.userInfo WHERE userId = $1"
    const values = [idValue]
    const inputData = {
        id : idValue
    }

    client.query(sql,values, (err,data) => {

        let result = {
            "success" : false,
        }

        const row = data.rows
        if (row.length != 0){
            //아이디가 이미 존재
            result.success = true
            return res.send(result)
        }
        else{
            //아이디가 존재하지 않음
            result.success = false
            res.send(result)
        }

        mongo.insertLogging(requestIp.getClientIp(req),idValue,"/account/idCheck",inputData,result,new Date())

    })
})

account.post("/account/resister",(req,res)=>{

    const idValue = req.body.idValue
    const pwValue = req.body.pwValue
    const userPhoneNumber = req.body.userPhoneNumber
    const userNickName = req.body.userNickName

    let result = {
        success : "",
        errorCode : ""
    }

    accountForm.checkSignUpForm(idValue,pwValue,userPhoneNumber,userNickName, (data) => {
        if (data != "통과"){
            console.log(data)
            result.success = false
            result.errorCode = data
            console.log(result)
            return res.send(result)
        }
        else{
            result.success = true
        }
     })

     if (result.success == false){
        return
     }

    const inputData = {
        id : idValue,
        password : pwValue,
        userPhoneNumber : userPhoneNumber,
        userNickName : userNickName
    }

    const sql = "INSERT INTO backend.userInfo (userId,userPw,userPhoneNumber,userNickName) VALUES ($1,$2,$3,$4) "
    const values =[idValue,pwValue,userPhoneNumber,userNickName]

    client.query(sql,values,(err,data) => {
        
        let result = {
            success : false,
            errorCode : ""
        }

        if (err) {
            console.log(err)
            result.success = false
            result.errorCode = "아이디 중복"
            return res.send(result)
        }
        else{
            result.success = true
            res.send(result)
        }

        mongo.insertLogging(requestIp.getClientIp(req),idValue,"/account/resister",inputData,result,new Date())

    })
    
})

account.post("/account/login", (req,res)=>{

    const idValue = req.body.id
    const pwValue = req.body.pw

    const sql = "SELECT * FROM backend.userInfo WHERE userId = $1 AND userPw = $2"
    const values = [idValue,pwValue]
    const inputData = {
        id : idValue,
        password : pwValue
    }

    client.query(sql,values, (err,data) => {

        let result = {
            "success" : true,
        }

        const row = data.rows
        if (row.length != 0){
            result.success = true
            
            req.session.user = {
                userId : idValue,
                userPw : pwValue
            }
            res.send(result)
        }
        else{
            result.success = false
            res.send(result)
        }

        mongo.insertLogging(requestIp.getClientIp(req),idValue,"/account/login",inputData,result,new Date())

    })
})

account.get("/account/logout", function (req, res, next) {

    console.log("zzzzzzzz")

    const userId = req.session.user.userId

    if((req.session.user)) {  
        req.session.user = undefined
    }

    let result = {
        "success" : true,
    }

    res.send(result)

    mongo.insertLogging(requestIp.getClientIp(req),userId,"/account/logout",{},result,new Date())

})

module.exports = account
