const client = require('../config/database')

module.exports = () => {
    return {
        verifyToken : (userId,token,callback) => {
            const sql2 = "SELECT usertoken FROM backend.userinfo WHERE userid = $1"
        
            client.query(sql2,[userId],(err,data) => {
        
                if (err) {
                    console.log(err)
                }
                else{
                    if (data.rows[0].usertoken == token){
                        return callback(true)
                    }
                    else{
                        return callback(false)
                    }
                }
            })
        }
    }
}