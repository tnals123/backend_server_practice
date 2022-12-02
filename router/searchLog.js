const router = require('express').Router()
const client = require('../config/database')
const jwt = require('jsonwebtoken')
var requestIp = require('request-ip');
let mongo = require('../modules/mongoController')();
let accountForm = require('../modules/signUpController')();
let redis = require('../modules/redisController')();

router.get("/log",(req,res) => {

    let result = {
        success : false,
        message : null,
        error : null
    }

    //redis에 로그인 추가
    redis.getRecentSearchLog((data) => {
        console.log(data)

        const set = new Set(data.messege);
        const uniqueArr = [...set];

        result.message = uniqueArr
        result.success = true
        res.send(result)
    })

})

router.post("/log",(req,res) => {

    const log = req.body.log
    console.log(log)
    let result = {
        success : false,
        message : null,
        error : null
    }

    if (log == ""){
        result.success = false
        result.error = "빈값"
        res.send(result)
    }
    else{
        //redis에 로그인 추가
        redis.updateRecentSearchLog(log,(data) => {
            console.log("zzzzzzzzzdfsdfs222")
            console.log(data)
            result.message = data
            result.success = true
            res.send(result)
        })
    }
})

module.exports = router