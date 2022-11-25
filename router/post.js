const router = require('express').Router()
const client = require('../config/database')
const upload = require('../modules/multer')
var requestIp = require('request-ip');
let mongo = require('../modules/mongoController')();
const aws = require('aws-sdk');
const jwt = require('jsonwebtoken')
require('dotenv').config();
aws.config.loadFromPath(__dirname + '/../json/awsconfig.json');
const s3 = new aws.S3();

router.get("/post",(req,res) => {

    let result = {
        success : false,
        userId : null,
        posts : {},
        error : null
    }

    const token = req.headers.authorization

    try{
        const userData = jwt.verify(token, process.env.SECRET_KEY);

        const sql2 = "SELECT usertoken FROM backend.userinfo WHERE userid = $1"

        client.query(sql2,[userData.id],(err,data) => {
    
            if (err) {
                console.log(err)
            }
            else{

                if (data.rows[0].usertoken == token){

                    console.log("맞음!")
                    result.userId = userData.id
    
                    const sql = "SELECT * FROM backend.userpost ORDER BY postnum"
                
                    client.query(sql, (err,data) => {
                
                        if (err) {
                            result.error = "데이터베이스 오류"
                            console.log(err)
                            res.send(result)
                            return
                        }
                
                        else{
                            const row = data.rows
                            if (row.length != 0){
                                result.success = true
                                result.posts = row
                                res.send(result)
                            }
                            else{
                                result.success = false
                                res.send(result)
                            }
                        }
                        mongo.insertLogging(requestIp.getClientIp(req),userData.id,"get/post",{},result,new Date())
                
                    })

                }
                else{
                    result.error = "다른 기기 로그인"
                    res.send(result)
                }
                
            }
        })
    }
    catch(e){
        console.log(e)
        result.error = "토큰오류"
        res.send(result)
    }

})

router.post("/post/detail",(req,res) => {

    let result = {
        success : false,
        userId : null,
        posts : {},
        error : null
    }

    const token = req.headers.authorization

    try{

        const userData = jwt.verify(token,process.env.SECRET_KEY)

        const sql2 = "SELECT usertoken FROM backend.userinfo WHERE userid = $1"

        client.query(sql2,[userData.id],(err,data) => {
    
            if (err) {
                console.log(err)
            }
            else{

                if (data.rows[0].usertoken == token){

                    result.userId = userData.id

                    upload.array('image')(req, res, (err)=>{ 
                
                        if(err){ 
                            console.log(err)
                            res.rend(result)
                        }
                    })
                
                    const postNum = req.body.postNum
                
                    let sql = "SELECT * FROM backend.userpost WHERE postnum = $1"
                    const inputData = {
                        postNum : postNum
                    }
                
                    client.query(sql,[postNum],(err,data) => {
                
                        if (err) {
                            console.log(err)
                            res.send(result)
                            return
                        }
                
                        else{
                            let rows = data.rows
                            result.success = true
                            result.posts = rows
                            res.send(result)
                        }
                
                        mongo.insertLogging(requestIp.getClientIp(req),userData.id,"/post/detail",inputData,result,new Date())
                
                    })


                }
                else{
                    result.error = "다른 기기 로그인"
                    res.send(result)
                }

            }
        })

    }

    catch(e){

    }


})

router.post("/post",upload.array('Image', 4), async (req,res)=>{

    upload.none()
    const postDate = req.body.postDate
    const postContents = req.body.postContents
    const token = req.headers.authorization

    let result = {
        success : false,
        error : null
    }

    try{
        const userData = jwt.verify(token, process.env.SECRET_KEY);

        const sql2 = "SELECT usertoken FROM backend.userinfo WHERE userid = $1"

        client.query(sql2,[userData.id],(err,data) => {
            
            let result = {
                success : false,
                error : ""
            }

            if (err) {
                console.log(err)
            }
            else{
                if (data.rows[0].usertoken == token){

                    console.log("맞음")

                    const inputData = {
                        id : userData.id,
                        postDate : postDate,
                        postContents : postContents,
                        comments : []
                    }
                
                    //array helper 로 바꾸기 for문쓰지말고
                
                    let imageArray = []
                    for(let i = 0; i < req.files.length; i++){
                        imageArray.push(req.files[i].key)
                    }
                
                    let sql = "INSERT INTO backend.userpost(userid,postdata,postcontents,postcomments,imagepath) VALUES ($1,$2,$3,$4,$5)"
                
                    client.query(sql,[userData.id,postDate,postContents,{"comments" : []},imageArray], (err,data) => {
                
                        if (err) {
                            console.log(err)
                            res.send(result)
                            return
                        }
                        else{
                            result.success = true
                            res.send(result)
                        }
                
                        mongo.insertLogging(requestIp.getClientIp(req),userData.id,"/post/post",inputData,result,new Date())
                
                    })
                    
                }
                else{
                    console.log("틀려요!!")
                    result.error = "다른 기기 로그인"
                    return res.send(result)
                }
            }
        })
    }
    catch(e){
        result.error = "토큰 오류"
        res.send(result)
    }

})

router.delete("/post",(req,res) => {

    const postNum = req.body.postNum
    const token = req.headers.authorization


    let result = {
        success : false,
        error : null
    }

    const inputData = {
        postNum : postNum
    }

    try{    
        const userData = jwt.verify(token, process.env.SECRET_KEY);

        const sql2 = "SELECT usertoken FROM backend.userinfo WHERE userid = $1"

        client.query(sql2,[userData.id],(err,data) => {
            
            let result = {
                success : false,
                error : ""
            }
    
            if (err) {
                console.log(err)
            }
            else{

                if (data.rows[0].usertoken == token){

                    let getImageSql = "SELECT imagepath FROM backend.userpost WHERE postnum = $1"

                    //사진을 s3에서 삭제
                    client.query(getImageSql,[postNum],(err,data)=>{
                
                        if (err) {
                            result.success = false
                            console.log(err)
                            res.send(result)
                            return
                        }
                        else{
                            if (data.rows[0].imagepath != null){
                                console.log(data.rows[0].imagepath)
                
                                let params = {
                                    Bucket: "soomin", 
                                    Delete: {
                                     Objects: [
                                     ], 
                                     Quiet: false
                                    }
                                   };
                                   
                                for (let i = 0 ; i <data.rows[0].imagepath.length; i++){
                                    params.Delete.Objects.push({
                                        Key : data.rows[0].imagepath[i]
                                    })
                                }
                
                                console.log(params.Delete.Objects)
                    
                                s3.deleteObjects(params, function(err, data) {
                                    if (err) console.log(err, err.stack); // an error occurred
                                    else     console.log(data);           // successful response
                                });
                            }
                        }
                
                    })
                
                    //게시물 삭제
                
                    let sql = "DELETE FROM backend.userpost WHERE postnum = $1"
                
                    client.query(sql,[postNum],(err,data)=>{
                
                        if (err) {
                            result.success = false
                            res.send(result)
                            return
                        }
                        else{
                            result.success = true
                            res.send(result)
                        }
                
                        mongo.insertLogging(requestIp.getClientIp(req),userData.id,"/delete/post",inputData,result,new Date())
                
                    })
                }

                else{
                    result.error = "다른 기기 로그인"
                    res.send(result)
                }
                
            }
        
        })
    }
    catch(e){
        result.error = "토큰 오류"
        res.send(result)
    }

})

router.put("/post",(req,res) => {

    const token = req.headers.authorization

    let result = {
        success : false,
        error : null
    }

    const newpostContents = req.body.newpostContents
    const postNum = req.body.postNum
    const inputData = {
        newpostContents : newpostContents,
        postNum : postNum
    }

    try{

        const userData = jwt.verify(token, process.env.SECRET_KEY);

        const sql2 = "SELECT usertoken FROM backend.userinfo WHERE userid = $1"

        client.query(sql2,[userData.id],(err,data) => {
            
            let result = {
                success : false,
                error : ""
            }
    
            if (err) {
                console.log(err)
            }
            else{
                console.log("맞음!")
                if (data.rows[0].usertoken == token){

                    let sql = "UPDATE backend.userpost SET postcontents = $1 WHERE postnum = $2"

                    client.query(sql,[newpostContents,postNum],(err,data) => {
                
                        if (err) {
                            result.success = false
                            res.send(result)
                            return
                        }
                        else{
                            result.success = true
                            res.send(result)
                        }
                
                        mongo.insertLogging(requestIp.getClientIp(req),userData.id,"/put/post",inputData,result,new Date())
                
                    })

                }
                else{
                    result.error = "다른 기기 로그인"
                    res.send(result)
                }
            }
        })

    }
    catch(e){
        result.error = "토큰 오류"
        res.send(result)
    }


})


module.exports = router