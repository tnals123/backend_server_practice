const router = require("express").Router()
const redis = require("redis").createClient()

router.post("/", async (req,res) => {

    let result = {
        "success" : false,
        "messege" : null
    }

    try {
        await redis.connect()
        const data = await redis.get("number")
        if (data){
            await redis.set("number", parseInt(data)+1)
        }
        else{
            await redis.set("number", 1)
        }
        await redis.disconnect()
        result.success = true
        result.messege = data
        res.send(result)

    }
    catch(e) {
        result.messege = err.messege
        res.send(result)
    }

})

router.get("/", async (req,res) => {

    let result = {
        "success" : false,
        "messege" : null,
        "data" : null
    }

    try {
        await redis.connect()
        const data = await redis.get("number")
        await redis.disconnect()
        result.success = true
        result.data = data
        res.send(result)

    }
    catch(e) {
        result.messege = e.messege
        res.send(result)
    }

})

module.exports = router