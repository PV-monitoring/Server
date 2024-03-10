const mysql = require("mysql");
const db = require("./connection.js");


// Query Database
async function queryDatabase(queryEntered) {
    return new Promise((resolve, reject) => {
        db.query(queryEntered, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}



module.exports = { queryDatabase };
