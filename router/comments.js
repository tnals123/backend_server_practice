const router = require('express').Router()
const client = require('../config/database')
var requestIp = require('request-ip');
let mongo = require('../modules/mongoController')();
const jwt = require('jsonwebtoken')

router.post("/comment",(req,res)=>{

    let result = {
        success : false,
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

                    const commentNum = req.body.commentNum
                    const idValue = req.body.idValue
                    const postDate = req.body.postDate
                    const postContents = req.body.postContents
                    const postNum = req.body.postNum
                    const inputData = {
                        commentNum : commentNum,
                        id : idValue,
                        postDate : postDate,
                        postContents : postContents,
                        postNum : postNum
                    }
                
                    console.log(commentNum)
                
                    //backend.userpost를 수정하는데, postcomment Column 에 있는 comments 에, json 데이터를 추가하고, 
                    //jsonb_set이 현재 array를 새로운 array로 바꿔줌  - (마지막 default 값이 true 기 때문에)
                    let sql = `UPDATE backend.userpost
                    SET postcomments = jsonb_set(postcomments, '{comments}', postcomments -> 'comments' || $1 ::jsonb) WHERE postnum = $2`
                
                    client.query(sql,[{commentnum : commentNum, userid : idValue , postdate : postDate, postcontents : postContents},postNum], (err,data) => {
                
                        if (err) {
                            console.log(err)
                            result.error = "데이터베이스 오류"
                            res.send(result)
                            mongo.insertLogging(requestIp.getClientIp(req),idValue,"/post/comment",inputData,result,new Date())
                            return
                        }
                        else{
                            result.success = true
                            res.send(result)
                            mongo.insertLogging(requestIp.getClientIp(req),idValue,"/post/comment",inputData,result,new Date())
                        }
                
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

router.put("/comment",(req,res)=>{

    let result = {
        success : false,
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

                    const commentNum = req.body.commentNum
                    const idValue = userData.id
                    const postDate = req.body.postDate
                    const postContents = req.body.postContents
                    const postNum = req.body.postNum
                    const inputData = {
                        commentNum : commentNum,
                        id : idValue,
                        postDate : postDate,
                        postContents : postContents,
                        postNum : postNum
                    }
                
                    console.log(commentNum)
                    console.log(postContents)
                
                    let sql = `UPDATE 
                                    backend.userpost
                                SET
                                    postcomments = 
                                        jsonb_set(
                                            postcomments,
                                            array['comments', elem_index::text, 'postcontents'],
                                            $1::jsonb,
                                            true)
                                FROM (
                                    SELECT 
                                        pos- 1 as elem_index
                                    FROM 
                                        backend.userpost, 
                                        jsonb_array_elements(postcomments->'comments') with ordinality arr(elem, pos)
                                    WHERE
                                        elem->>'commentnum' = $2
                                    ) sub
                                    WHERE 
                                        postnum = $3; `
                
                    client.query(sql,['\"'+postContents+'\"',commentNum,postNum], (err,data) => {
                
                        if (err) {
                            console.log(err)
                            result.error = "데이터베이스 오류"
                            res.send(result)
                            mongo.insertLogging(requestIp.getClientIp(req),idValue,"/put/comment",inputData,result,new Date())
                            return
                        }
                        else{
                            result.success = true
                            res.send(result)
                            mongo.insertLogging(requestIp.getClientIp(req),idValue,"/put/comment",inputData,result,new Date())
                        }
                
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

router.delete("/comment",(req,res)=>{

    let result = {
        success : false,
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

                    const commentNum = req.body.commentNum
                    const postNum = req.body.postNum
                    const inputData = {
                        commentNum : commentNum,
                        postNum : postNum
                    }
                
                    console.log(commentNum)
                
                    let sql = `WITH t as (
                        SELECT JSON_AGG(comments) AS comments
                        FROM(
                        SELECT JSONB_ARRAY_ELEMENTS(postcomments->'comments') AS comments
                        FROM backend.userpost WHERE postnum = $1
                        ) t
                        WHERE comments->>'commentnum' != $2
                        )
                        UPDATE backend.userpost SET postcomments = jsonb_set(postcomments, '{comments}', t.comments :: jsonb , false) FROM t WHERE postnum = $3
                        `
                    
                        client.query(sql,[postNum,commentNum,postNum], (err,data) => {
                    
                            if (err) {
                
                                let mysql = 
                                    `UPDATE backend.userpost SET postcomments = jsonb_set(postcomments, '{comments}', '[]' :: jsonb , false) WHERE postnum = $1`
                
                                client.query(mysql,[postNum],(err,data) => {
                
                                    if (err) {
                                        console.log(err)
                                        result.error = "데이터베이스 오류"
                                        res.send(result)
                                        return
                                    }
                
                                    else{
                                        result.success = true
                                        res.send(result)
                                        mongo.insertLogging(requestIp.getClientIp(req),userData.id,"/delete/comment",inputData,result,new Date())
                                    }
                                
                                })
                                
                            }
                            else{
                                result.success = true
                                res.send(result)
                                mongo.insertLogging(requestIp.getClientIp(req),userData.id,"/delete/comment",inputData,result,new Date())
                            }
                    
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