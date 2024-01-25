import mysql from "mysql"

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password:'',
    database: 'pv_monitoring',

})

db.connect(function(err) {
    if(err) {
        console.error("database connection error:", err)
    }
    else {
        console.log("DataBase Connected")
    }
})

export default db;