const db = require('../database/connection.js');
const { exec } = require('child_process');

function monitorDatabase() {
    const connection = db;
    let lastId = null; // Initialize lastId with a default value

    // Start monitoring
    getLastId(connection, (id) => {
        lastId = id; // Update the outer scope lastId with the fetched lastId
        // Check for changes immediately
        checkForChanges(connection, lastId);

        // Poll the database periodically for changes
        const intervalInMilliseconds = 10 * 1000; // 10 seconds
        setInterval(() => checkForChanges(connection, lastId), intervalInMilliseconds);
    });
}

// Function to get the last ID from the database
function getLastId(connection, callback) {
    const getLastIdQuery = connection.query('SELECT MAX(last_refresh_time) AS last_id FROM inverter_data');
    getLastIdQuery.on('result', (row) => {
        const lastId = row.last_id || null; // Update lastId with the last ID from the database or null if no rows exist
        callback(lastId);
        console.log(`Initial last_refresh_time: ${lastId}`);
    });
    getLastIdQuery.on('error', (err) => {
        console.error('Error getting last ID:', err);
    });
}

function checkForChanges(connection, lastId) {
    if (lastId === null) {
        // If lastId is not set, it means there was no data initially
        console.log('No initial data found.');
        return;
    }

    // Query the database for new rows since the last known last_refresh_time
    const query = connection.query('SELECT * FROM inverter_data WHERE STR_TO_DATE(last_refresh_time, "%Y-%m-%d %H:%i:%s") > ?', [lastId]);
    query.on('result', (row) => {
        // Handle new row insertion
        console.log('New row inserted:', row);

        // Update lastId to the latest row's last_refresh_time
        lastId = row.last_refresh_time;

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

    query.on('error', (err) => {
        console.error('Error querying new rows:', err);
    });

    query.on('end', () => {
        console.log(`Updated last_refresh_time: ${lastId}`);
    });

    // Handle MySQL errors
    connection.on('error', (err) => {
        console.error('MySQL error:', err);
    });
}

module.exports = { monitorDatabase };
