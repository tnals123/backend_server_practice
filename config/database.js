const {Client} = require("pg")

const client = new Client({
    user : "ubuntu",
    password : "dkssud1010@",
    host : "localhost",
    database : "stageus",
    port : 5432
})

client.connect((err) => {
    if (err) {
        console.log(err)
        res.send(err)
        return
    }
})

module.exports = client