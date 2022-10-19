const mongodb = require("mongodb").MongoClient

module.exports = () => {
    return {
      insertLogging : (userIp,userId,apiName,inputData,outputData,loggingTime) => {

        mongodb.connect("mongodb://localhost:27017",(err,database) => {

            if (err){
                console.log(err)
                res.send(result)
            }
            else{

                const logObject = {
                    userIp : userIp,
                    userId : userId,
                    apiName : apiName,
                    inputData : inputData,
                    outputData : outputData,
                    loggingTime : loggingTime,
                }

                database.db("stageus").collection("logging").insertOne(logObject,(err,data) => {
                
                    if (err){
                        console.log(err)
                    }
                    else{
                        console.log("성공")
                        console.log(data)
                    }
                    
                    database.close()
                })
            }
        })

      }
    }
  };