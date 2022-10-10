const comments = require('express').Router()
const client = require('../config/database')

comments.post("/comment",(req,res)=>{
    
    const commentNum = req.body.commentNum
    const idValue = req.body.idValue
    const postDate = req.body.postDate
    const postContents = req.body.postContents
    const postNum = req.body.postNum

    console.log(commentNum)

    //backend.userpost를 수정하는데, postcomment Column 에 있는 comments 에, json 데이터를 추가하고, 
    //jsonb_set이 현재 array를 새로운 array로 바꿔줌  - (마지막 default 값이 true 기 때문에)
    let sql = `UPDATE backend.userpost
    SET postcomments = jsonb_set(postcomments, '{comments}', postcomments -> 'comments' || $1 ::jsonb) WHERE postnum = $2`

    client.query(sql,[{commentnum : commentNum, userid : idValue , postdate : postDate, postcontents : postContents},postNum], (err,data) => {

        let result = {
            success : false,
        }

        if (err) {
            console.log(err)
            res.send(result)
            return
        }
        else{
            result.success = true
            res.send(result)
        }

    })

})

comments.put("/comment",(req,res)=>{
    
    const commentNum = req.body.commentNum
    const idValue = req.body.idValue
    const postDate = req.body.postDate
    const postContents = req.body.postContents

    console.log(commentNum)

    let sql = `UPDATE backend.userpost
    SET postcomments = jsonb_set(postcomments,'{comments}',  $1 ::jsonb , false) WHERE postcomments->comments`
    client.query(sql,[{commentnum : commentNum, userid : idValue , postdate : postDate, postcontents : postContents}], (err,data) => {

        let result = {
            success : false,
        }

        if (err) {
            console.log(err)
            res.send(result)
            return
        }
        else{
            result.success = true
            res.send(result)
        }

    })

})

comments.delete("/comment",(req,res)=>{
    
    const commentNum = req.body.commentNum
    const postNum = req.body.postNum

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

            let result = {
                success : false,
            }
    
            if (err) {

                let mysql = 
                    `UPDATE backend.userpost SET postcomments = jsonb_set(postcomments, '{comments}', '[]' :: jsonb , false) WHERE postnum = $1`

                client.query(mysql,[postNum],(err,data) => {

                    if (err) {
                        console.log(err)
                        res.send(err)
                        return
                    }

                    else{
                        result.success = true
                        res.send(result)
                    }
                
                })
                
            }
            else{
                result.success = true
                res.send(result)
            }
    
        })

})

module.exports = comments