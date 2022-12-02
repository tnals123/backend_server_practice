const router = require('express').Router()
const client = require('../config/database')
const jwt = require('jsonwebtoken')
var requestIp = require('request-ip');
let mongo = require('../modules/mongoController')();
let accountForm = require('../modules/signUpController')();
let redis = require('../modules/redisController')();

const secretKey = "HANDSOMEGUYSOOMINANDGYONGCHAN"

router.post("/account/verify", (req,res) => {
    const token = req.body.token
    const result = {
        "success" : false
    }
    try{
        jwt.verify(token,secretKey)
        result.success = true
        res.send(result)
    }
    catch(e){
        console.log(e)
    }
})

router.get("/account/loginCount", (req,res) => {
    const result = {
        "success" : false,
        "count" : null,
        "errer" : null
    }

    try{
        redis.getLoginCount((data) => {
            result.count = data.messege
            result.success = true
            res.send(result)
        })
    }
    catch(e){
        result.errer = e
        res.send(result)
    }
})

router.post("/account/idCheck",(req,res) => {

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

router.post("/account/resister",(req,res)=>{

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

router.post("/account/login", (req,res)=>{

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
            "token" : null
        }

        const row = data.rows
        if (row.length != 0){
            result.success = true

            //redis에 로그인 추가
            redis.updateLoginCount(idValue, (data) => {
                console.log(data)
                
                //현재 세션을 redis에 저장
                console.log("저장!")
                redis.storeSession(req.session.id,(data) => {
                    console.log(data)
                })
            })

            //token 생성
            const token = jwt.sign(
                {
                    id : row[0].userid,
                },
                //특정한 secret 키
                secretKey,
                {
                    "expiresIn" : "24h",
                    "issuer" : "stageus"
                }
            )

            //userinfo 에 토큰 변경

            const sql = "UPDATE backend.userinfo SET usertoken = $1 WHERE userId = $2"

            client.query(sql,[token,row[0].userid],(err,data) => {
        
                if (err) {
                    console.log(err)
                }
        
            })

            result.token = token

            console.log(result)
            
            res.send(result)
        }
        else{
            result.success = false
            res.send(result)
        }

        mongo.insertLogging(requestIp.getClientIp(req),idValue,"/account/login",inputData,result,new Date())

    })
})

router.get("/account/logout", function (req, res, next) {

    let result = {
        "success" : true,
    }

    res.send(result)

    mongo.insertLogging(requestIp.getClientIp(req),"","/account/logout",{},result,new Date())

})

module.exports = router
