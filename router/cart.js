const router = require("express").Router()
const redis = require("redis").createClient()

router.post("/increase", async (req,res) => {

    let result = {
        "success" : false,
        "messege" : null
    }

    const itemName = req.body.item_name

    try {
        await redis.connect()
        const result = await redis.lpush("mylist", "one", "two")

        await redis.disconnect()
        result.success = true
        result.messege = data
        res.send(result)

    }
    catch(e) {
        console.log(e)
        res.send(result)
    }

})

router.get("/", async (req,res) => {

    let result = {
        "success" : false,
        "messege" : null
    }

    const itemName = req.body.item_name

    try {
        await redis.connect()
        const data = await redis.hGetAll("cart")

        await redis.disconnect()
        result.success = true
        result.messege = data
        res.send(result)

    }
    catch(e) {
        console.log(e)
        result.messege = e
        res.send(result)
    }

})

router.delete("/", async (req,res) => {


    let result = {
        "success" : false,
        "messege" : null
    }

    const itemName = req.body.item_name

    try {
        await redis.connect()
        await redis.del("cart")
        await redis.disconnect()
        result.success = true
        result.messege = data
        res.send(result)

    }
    catch(e) {
        console.log(e)
        result.messege = e
        res.send(result)
    }
})

router.post("/decrease", async (req,res) => {

    let result = {
        "success" : false,
        "messege" : null
    }

    const itemName = req.body.item_name

    try {
        await redis.connect()
        const data = await redis.hGet("cart",itemName)
        if (data){
            await redis.hSet("cart",itemName,parseInt(data)-1)
        }
        else{
            throw {
                e : "해당 아이템이 장바구니에 없습니당~~~"
            }
        }

        await redis.disconnect()
        result.success = true
        result.messege = data
        res.send(result)

    }
    catch(e) {
        console.log(e)
        result.messege = e
        res.send(result)
    }

})

module.exports = router