const post = require('express').Router()
const client = require('../config/database')

post.get("/post",(req,res) => {

    const sql = "SELECT * FROM backend.userpost"

    client.query(sql, (err,data) => {

        let result = {
            success : false,
            posts : {}
        }

        if (err) {
            console.log(err)
            res.send(result)
            return
        }

        else{
            const row = data.rows
            if (row.length != 0){
                console.log(row)
                result.success = true
                result.posts = row
                res.send(result)
            }
            else{
                result.success = false
                res.send(result)
            }
        }

    })

})

post.post("/post/detail",(req,res) => {

    let connection = require('./database/maria')

    const postNum = req.body.postNum

    let loginResult = maria.selectData(["postNum"],"postInfo")
    connection.query(loginResult,[postNum],(err,result)=>{

        console.log(result)

        let postObject = {postList : []}

        for (let i = 0 ; i<result.length; i++){
            postObject.postList.push(result[i])
        }

        res.send(postObject)

    })

})

post.post("/post/write",(req,res)=>{
    
    const idValue = req.body.idValue
    const postDate = req.body.postDate
    const postContents = req.body.postContents

    maria.insertData(["postUserId","postContents","postDATE"],
                     [idValue,postContents,postDate],"postInfo")

    let result = {
    "success" : true,
    }

    res.send(result)

})

post.delete("/post/delete",(req,res) => {

    const postNum = req.body.postNum

    maria.deleteData(["postNum"],[postNum],"postInfo")

    let result = {
        "success" : true,
    }

    res.send(result)

})

post.put("/post/update",(req,res) => {

    const newpostContents = req.body.newpostContents
    const postNum = req.body.postNum

    maria.updataData(["postContents"],["postNum"],[newpostContents,postNum],"postInfo")

    let result = {
        "success" : true,
    }

    res.send(result)

})

module.exports = post