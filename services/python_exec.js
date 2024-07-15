const db = require('../database/connection.js');
const { exec } = require('child_process');

function monitorDatabase() {
    const connection = db;
    let lastId = 0; // Initialize lastId with a default value

    // Start monitoring
    getLastId(lastId, connection, () => {
        // // Check for changes immediately
        checkForChanges(lastId, connection);

        // Poll the database periodically for changes
        const intervalInMilliseconds = 10 * 1000; // 10 seconds
        setInterval(checkForChanges, intervalInMilliseconds);
    });
}

// Function to get the last ID from the database
function getLastId(lastId, connection, callback) {
    const getLastIdQuery = connection.query('SELECT MAX(last_refresh_time) AS last_id FROM inverter_data');
    getLastIdQuery.on('result', (row) => {
        lastId = row.last_id || 0; // Update lastId with the last ID from the database or 0 if no rows exist
        callback(lastId);
        console.log(lastId);
    });
    getLastIdQuery.on('error', (err) => {
        console.error('Error getting last ID:', err);
    });
}

function checkForChanges(lastId, connection) {
    // console.log(lastId);
    // Query the database for new rows since the last known ID
    const query = connection.query('SELECT * FROM inverter_data WHERE STR_TO_DATE(last_refresh_time, "%Y-%m-%d %H:%m:%s") > ?', [lastId]);
    query.on('result', (row) => {
        // Handle new row insertion
        // console.log('New row inserted:', row);

        // Execute main.py script
        exec('python main.py', (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing main.py: ${error}`);
                return;
            }
            console.log(`main.py output: ${stdout}`);

            // Execute cleaning.py script
            exec('python cleaning.py', (cleanError, cleanStdout, cleanStderr) => {
                if (cleanError) {
                    console.error(`Error executing cleaning.py: ${cleanError}`);
                    return;
                }
                console.log(`cleaning.py output: ${cleanStdout}`);
            });
        });
    });

    // Handle MySQL errors
    connection.on('error', (err) => {
        console.error('MySQL error:', err);
    });
}

module.exports = { monitorDatabase };