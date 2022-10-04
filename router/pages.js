const router = require('express').Router()
const path = require('path')
//api 등록 재료

router.get("/" , (req,res) => {
    res.sendFile(path.join(__dirname + "/../index.html"))
})

router.get("/loginPage",(req,res)=>{
    res.sendFile(path.join(__dirname + "/../loginPage.html"))
})

router.get("/post/new",(req,res)=>{
    res.sendFile(path.join(__dirname + "/../writePost.html"))
})

router.get("/postDetail/:postNum",(req,res)=> {
    res.sendFile(path.join(__dirname,'postDetailPage.html'))
})

router.get("/signUpPage",(req,res)=>{
    res.sendFile(path.join(__dirname + "/../signUpPage.html"))
})

router.get("/postPage",(req,res)=>{
    res.sendFile(path.join(__dirname + "/../postPage.html"))
})

module.exports = router