const redis = require("redis").createClient()

module.exports = () => {
    return {

        updateRecentSearchLog : async (searchLog,callback) => {

            let result = {
                "success" : false,
                "messege" : null
            }
        
            try {
                console.log(searchLog)
                await redis.connect()
                console.log("연결 완료")
                await redis.lPush("searchLog",searchLog)
                await redis.disconnect()
                result.success = true
                return callback(result)
        
            }
            catch(e) {
                console.log(e)
                result.success = false
                result.messege = e
                return callback(result)
            }
                
        },

        getRecentSearchLog : async (callback) => {

            let result = {
                "success" : false,
                "messege" : null
            }
        
            try {
                await redis.connect()
                let searchArray = await redis.lRange('searchLog',0,-1)
                await redis.disconnect()
                result.success = true
                result.messege = searchArray
                return callback(result)
        
            }
            catch(e) {
                result.success = false
                result.messege = e
                return callback(result)
            }
                
        },

        updateLoginCount : async (userName,callback) => {

            let result = {
                "success" : false,
                "messege" : null
            }
        
            try {
                await redis.connect()
                const data = await redis.hGet("loginUser",userName)
                const loginCount = await redis.get("loginCount")
                if (!loginCount){
                    await redis.set("loginCount", 0)
                }
                else{
                    if (data){
                    }
                    else{
                        await redis.set("loginCount", parseInt(loginCount)+1)
                        await redis.hSet("loginUser",userName,1)
                    }
                }
        
                await redis.disconnect()
                result.success = true
                return callback(result)
        
            }
            catch(e) {
                console.log(e)
                result.success = false
                result.messege = e
                return callback(result)
            }
                
        },

        getLoginCount : async (callback) => {

            let result = {
                "success" : false,
                "messege" : null
            }
        
            try {
                await redis.connect()
                const loginCount = await redis.get("loginCount")
                await redis.disconnect()

                result.success = true
                result.messege = loginCount

                return callback(result)
        
            }
            catch(e) {
                console.log(e)
                result.success = false
                result.messege = e
                return callback(result)
            }
                
        },

        initLoginCount : async (callback) => {

            let result = {
                "success" : false,
                "messege" : null
            }
        
            try {
                console.log("연결완료22222")
                await redis.connect()
                await redis.set("loginCount", 0)
                await redis.del("loginUser")
                await redis.disconnect()
            }
            catch(e) {
                result.success = false
                result.messege = e
                return callback(result)
            }
                
        },

        storeSession : async (sessionId,callback) => {

            let result = {
                "success" : false,
                "messege" : null
            }

            try {
                await redis.connect()
                await redis.set("storeSession", sessionId)
                await redis.disconnect()
                result.success = true
                result.messege = "성공"
                return callback(result)
            }
            catch(e) {
                console.log(e)
            }
                
        },

        getSession : async (callback) => {

            try {
                await redis.connect()
                const session = await redis.get("storeSession")
                console.log(session)
                await redis.disconnect()
                return callback(session)
            }
            catch(e) {
                console.log(e)
            }
                
        }
    }
}