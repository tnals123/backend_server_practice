const mongodb = require("mongodb").MongoClient

module.exports = () => {

    return {

      insertLogging : (userIp,userId,apiName,inputData,outputData,loggingTime) => {

        mongodb.connect("mongodb://localhost:27017",(err,database) => {

            if (err){
                console.log(err)
                return
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
                        console.log(data)
                    }
                    
                    database.close()
                })
            }
        })

      },

      getLogging : (parameterArray,timeRange,timeSort,callback) => {

        mongodb.connect("mongodb://localhost:27017",(err,database) => {

            if (err){
                console.log(err)
                return
            }
            
            else{

                var json = JSON.parse(parameterArray);
                console.log(json)
                console.log(timeRange);

                if (timeRange != ""){

                    let timeJson = {
                        "loggingTime": {"$gte": new Date(timeRange.start), "$lt": new Date(timeRange.end)}
                    }
                    let resultJson = Object.assign(json,timeJson)

                    database.db("stageus").collection("logging").find(resultJson).sort({"loggingTime" : timeSort}).toArray((err,data) => {
            
                        if (err){
                            result.success = false
                            console.log(err)
                        }
                        else{
                            console.log("송공!!!")
                            return callback(data)
                        }
                        database.close()
                    })

                }
                else{

                    database.db("stageus").collection("logging").find(json).sort({"loggingTime" : timeSort}).toArray((err,data) => {
            
                        if (err){
                            result.success = false
                            console.log(err)
                        }
                        else{
                            console.log("송공!!!")
                            return callback(data)
                        }
                        database.close()
                    })

                }

            }
        })

      }
    }
  };