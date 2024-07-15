const db = require('./connection.js');

const getGenerationDataFromDB = async () => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT DATE_FORMAT(t1.last_refresh_time, '%d %b') as date, t1.total_generation
            FROM inverter_data t1
            JOIN (
                SELECT	
                    DATE(last_refresh_time) as date, 
                    MAX(last_refresh_time) as max_datetime
                FROM inverter_data
                WHERE last_refresh_time >= CURRENT_DATE - INTERVAL 31 DAY AND last_refresh_time < CURRENT_DATE
                GROUP BY DATE(last_refresh_time)
            ) t2
            ON t1.last_refresh_time = t2.max_datetime
            ORDER BY t1.last_refresh_time ASC;
        `;
        db.query(query, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
}

const getTodayGenerationDataFromDB = async () => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT DATE_FORMAT(last_refresh_time, '%d %b') as date, daily_generation
            FROM inverter_data
            ORDER BY last_refresh_time DESC
            LIMIT 1;
        `;
        db.query(query, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
}

module.exports = { 
    getGenerationDataFromDB,
    getTodayGenerationDataFromDB, 
};