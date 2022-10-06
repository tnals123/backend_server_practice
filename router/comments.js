const comments = require('express').Router()
const client = require('../config/database')

comments.post("/comment",(req,res)=>{
    
    const commentNum = req.body.commentNum
    const idValue = req.body.idValue
    const postDate = req.body.postDate
    const postContents = req.body.postContents

    console.log(commentNum)

    let sql = `UPDATE backend.userpost
    SET postcomments = jsonb_set(postcomments, '{comments}', postcomments -> 'comments' || $1 ::jsonb)`

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

module.exports = comments