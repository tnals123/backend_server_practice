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

    const postNum = req.body.postNum

    let sql = "SELECT * FROM backend.userpost WHERE postnum = $1"

    client.query(sql,[postNum],(err,data) => {

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
            let rows = data.rows
            result.success = true
            result.posts = rows
            res.send(result)
        }

    })

  

})

post.post("/post",(req,res)=>{
    
    const idValue = req.body.idValue
    const postDate = req.body.postDate
    const postContents = req.body.postContents

    let sql = "INSERT INTO backend.userpost(userid,postdata,postcontents,postcomments) VALUES ($1,$2,$3,$4)"

    client.query(sql,[idValue,postDate,postContents,{"comments" : []}], (err,data) => {

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

post.delete("/post",(req,res) => {

    const postNum = req.body.postNum
    console.log("삭제 시작")

    let sql = "DELETE FROM backend.userpost WHERE postnum = $1"

    client.query(sql,[postNum],(err,data)=>{

        let result = {
            "success" : false,
        }

        if (err) {
            result.success = false
            res.send(result)
            return
        }
        else{
            result.success = true
            res.send(result)
        }

    })
})

post.put("/post",(req,res) => {

    const newpostContents = req.body.newpostContents
    const postNum = req.body.postNum

    let sql = "UPDATE backend.userpost SET postcontents = $1 WHERE postnum = $2"

    client.query(sql,[newpostContents,postNum],(err,data) => {

        let result = {
            "success" : false,
        }

        if (err) {
            result.success = false
            res.send(result)
            return
        }
        else{
            result.success = true
            res.send(result)
        }

    })

})

module.exports = post