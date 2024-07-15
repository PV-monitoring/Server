const db = require('./connection.js');

const getStatus = async () => {
    return new Promise((resolve, reject) => {
        const query = "SELECT Status FROM output ORDER BY Time DESC LIMIT 1";
        db.query(query, (error, result) => {
            if (error) {
                console.log(error.message);
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
}

const getCleaningCycleUpdate = async () => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT 
    DATE_ADD(STR_TO_DATE(last_cleaning_date, '%m/%d/%Y %H:%i'), INTERVAL days DAY) AS estimated_date 
FROM cleaning 
ORDER BY time DESC 
LIMIT 1;
        `;
        db.query(query, (error, result) => {
            if (error) {
                console.log(error.message);
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
}

module.exports = { getStatus, getCleaningCycleUpdate };