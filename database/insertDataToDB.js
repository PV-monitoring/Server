const mysql = require('mysql');
const db = require('./connection.js');

// Function to insert data into the database
async function insertDataIntoDatabase(table_name, primary_key, data) {
  return new Promise(async (resolve, reject) => {
    if (!data || data.length === 0) {
      console.log('No data to insert.');
      resolve();
      return;
    }
    
    // Check if the table exists, create it if it doesn't
    const tableExists = await checkTableExists(table_name);
    console.log(table_name)
    if (!tableExists) {
      await createTable(table_name, primary_key, data);
    }

    const isArray = Array.isArray(data);
    const keys = Object.keys(isArray ? data[0] : data);
    const columns = keys.join(', ');
    const placeholders = keys.map(() => '?').join(', ');

    // Iterate through the data array and insert each record into the database
    const SQL = `INSERT IGNORE INTO ${table_name} (${columns}) VALUES ${isArray ? '?' : '(?)'}`;

    const values = isArray
      ? data.map((record) => keys.map((key) => record[key]))
      : [keys.map((key) => data[key])];

    // Execute the SQL query
    db.query(SQL, isArray ? [values] : values, (error) => {
      if (error) {
        console.error('Error inserting data into the database:', error.message);
        reject(error);
      } else {
        console.log('Data inserted into the database successfully.');
        resolve();
      }
    });
  });
}

// Function to check if a table exists in the database
async function checkTableExists(tableName) {
  return new Promise((resolve, reject) => {
    const SQL = `SHOW TABLES LIKE '${tableName}'`;
    db.query(SQL, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results.length > 0);
      }
    });
  });
}

// Function to create a table based on data structure
async function createTable(tableName, primary_key, data) {
  const isArray = Array.isArray(data);
  const keys = Object.keys(isArray ? data[0] : data);
  const columnDefinitions = keys.map((key) => `${key} VARCHAR(100)`).join(', ');
  // const newColumnDefinitions = `${index} INT AUTO_INCREMENT, ` + `${columnDefinitions}`
  const SQL = `CREATE TABLE ${tableName} (${columnDefinitions}, PRIMARY KEY (${primary_key}))`;
  
  return new Promise((resolve, reject) => {
    db.query(SQL, (error) => {
      if (error) {
        reject(error);
      } else {
        console.log(`Table ${tableName} created successfully.`);
        resolve();
      }
    });
  });
}

module.exports = { insertDataIntoDatabase };
