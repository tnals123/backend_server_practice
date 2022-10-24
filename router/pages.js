const router = require('express').Router()
const path = require('path')
var requestIp = require('request-ip');
let mongo = require('../modules/mongoController')();
//api 등록 재료

router.get("/" , (req,res) => {

    if(req.session.user){
        mongo.insertLogging(requestIp.getClientIp(req),req.session.user.userId,"/",{},{},new Date())
    }
    else{
        mongo.insertLogging(requestIp.getClientIp(req),"None","/",{},{},new Date())
    }

    res.sendFile(path.join(__dirname + "/../index.html"))
})

router.get("/loginPage",(req,res)=>{

    if(req.session.user){
        mongo.insertLogging(requestIp.getClientIp(req),req.session.user.userId,"/loginPage",{},{},new Date())
    }
    else{
        mongo.insertLogging(requestIp.getClientIp(req),"None","/loginPage",{},{},new Date())
    }

    res.sendFile(path.join(__dirname + "/../loginPage.html"))
})

router.get("/post/new",(req,res)=>{

    if(req.session.user){
        mongo.insertLogging(requestIp.getClientIp(req),req.session.user.userId,"/post/new",{},{},new Date())
    }
    else{
        mongo.insertLogging(requestIp.getClientIp(req),"None","/post/new",{},{},new Date())
    }

    res.sendFile(path.join(__dirname + "/../writePost.html"))
})

router.get("/postDetail/:postNum",(req,res)=> {

    if(req.session.user){
        mongo.insertLogging(requestIp.getClientIp(req),req.session.user.userId,"/postDetail/:postNum",{},{},new Date())
    }
    else{
        mongo.insertLogging(requestIp.getClientIp(req),"None","/postDetail/:postNum",{},{},new Date())
    }

    res.sendFile(path.join(__dirname,'/../postDetailPage.html'))
})

router.get("/signUpPage",(req,res)=>{

    if(req.session.user){
        mongo.insertLogging(requestIp.getClientIp(req),req.session.user.userId,"/signUpPage",{},{},new Date())
    }
    else{
        mongo.insertLogging(requestIp.getClientIp(req),"None","/signUpPage",{},{},new Date())
    }

    res.sendFile(path.join(__dirname + "/../signUpPage.html"))
})

router.get("/postPage",(req,res)=>{

    if(req.session.user){
        mongo.insertLogging(requestIp.getClientIp(req),req.session.user.userId,"/postPage",{},{},new Date())
    }
    else{
        mongo.insertLogging(requestIp.getClientIp(req),"None","/postPage",{},{},new Date())
    }

    res.sendFile(path.join(__dirname + "/../postPage.html"))
})

router.get("/logPage" , (req,res) => {

    mongo.insertLogging(requestIp.getClientIp(req),req.session.user.userId,"/logPage",{},{},new Date())

    res.sendFile(path.join(__dirname + "/../logPage.html"))
})

module.exports = router