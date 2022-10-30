const mongoRouter = require('express').Router()
let mongo = require('../modules/mongoController')();

mongoRouter.post("/log", (req,res)=>{

    const userId = req.body.userId
    const apiName = req.body.apiName
    const timeRange = req.body.timeRange
    const timeSort = req.body.timeSort

    let arr = [userId,apiName]
    let parameterArr = ["userId", "apiName"]
    let parNum = 0;
    let num = 0;

    for(let i = 0; i <arr.length; i++){
        if (arr[i] != ""){
            parNum += 1
        }
    }

    let json = '{'

    for (let i = 0 ; i<arr.length; i++){
        if (arr[i] != ""){
            num += 1
            if (num != parNum){
                json += '\"'+ parameterArr[i] + '\"' + " : " + '\"'+  arr[i]+ '\"' + ", "
            }
            else{
                json += '\"'+ parameterArr[i] + '\"' + " : " + '\"'+  arr[i]+ '\"'
            }
        }
        
    }

    json += '}'

     mongo.getLogging(json,timeRange,timeSort, (data) => {
        res.send(data)
     })

})


module.exports = mongoRouter