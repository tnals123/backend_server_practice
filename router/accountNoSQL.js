const account = require('express').Router()
const mongodb = require("mongodb").MongoClient

account.post("/accountNoSQL/login",(req,res)=>{

    const idValue = req.body.id
    const pwValue = req.body.pw

    let result = {
        "success" : false,
    }

    mongodb.connect("mongodb://localhost:27017",(err,database) => {
        if (err){
            console.log("에러!!!!")
            console.log(err)
            res.send(result)
        }
        else{
            const data = {
                "id" : idValue,
                "pw" : pwValue,
            }
            database.db("stageus").collection("account").find(data).toArray((err,data) => {
            
                if (err){
                    result.success = false
                    console.log(err)
                }
                else{
                    if (data.length != 0){
                        result.success = true
                        console.log(data)
                    }
                    else{
                        console.log(data.length)
                        result.success = false
                    }
                }
                res.send(result)
                database.close()
            })
        }
    })

})


module.exports = account