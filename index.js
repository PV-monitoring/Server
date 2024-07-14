const express = require("express");
const http = require('http');
const cors = require("cors");
require("dotenv").config();
const { APISignIn } = require("./api/token.js");
const { _GetUserPlantList, getInverterListByPlantId, GetInverterData } = require("./api/functions.js");
const { initializeWebSocket } = require('./sockets/socketsHandler.js');
const { insertDataIntoDatabase } = require('./database/insertDataToDB.js');

const axios = require("axios");
const fs = require("fs");
const path = require("path");

const signupRouter = require("./routes/signup.js");
const loginRouter = require("./routes/login.js");

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cors());
app.use("/", signupRouter);
app.use("/", loginRouter);

const BaseURL= process.env.BaseURL
const GetUserPlantList= process.env.GetUserPlantList
const PORT = process.env.PORT || 5001;

// Initialize WebSocket
initializeWebSocket(server);

// app.listen(3002, () => {
//   console.log(`Server is running on port --> ${PORT}`);
// })

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port --> ${PORT}`);
});

app.post("/", async (req, res) => {
  await APISignIn();
  res.send("Token Renewed")
  console.log("Token Renewed")
})

app.get("/getplant", async (req, res) => {
  try {
    const _res = await _GetUserPlantList() 
    res.json({ mydata: _res.data });
    const table_name = "plants"
    const primary_key = "plant_id"
    await insertDataIntoDatabase(table_name, primary_key, _res.data.data.list)
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
});


// Periodically fetch and insert data into the database
const intervalInMilliseconds = 30 * 1000; // 1 second
setInterval(fetchAndInsertData, intervalInMilliseconds);

// Function to fetch and insert data into the database
// Function to fetch and insert data into the database
async function fetchAndInsertData() {
  try {
    // Fetch plant data from the API
    const _res = await GetInverterData("5036KMTU221W0223");
    // display the fetched data
    //console.log("Fetched data:", _res.data.data);
    // Insert the fetched data into the database
    const table_name = "inverter_data";
    const primary_key = "last_refresh_time";
    
    // Function to remove the mppt field
    const removeMpptField = (data) => {
      if (Array.isArray(data)) {
        return data.map(({ mppt, ...rest }) => rest);
      } else {
        const { mppt, ...rest } = data;
        return rest;
      }
    };

    // Exclude the mppt field
    const dataWithoutMppt = removeMpptField(_res.data.data);

    //console.log("new data:",dataWithoutMppt);
    await insertDataIntoDatabase(table_name, primary_key,dataWithoutMppt);
    // console.log(Data inserted into the database at ${new Date()});
  } catch (error) {
    console.error('Error fetching and inserting data:', error.message);
  }
}



// app.get("/plants", async (req, res) => {
//   try {
//     const _res = await _GetUserPlantList();
//     res.json({ plants: _res.data.data.list });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: error.message });
//   }
// });

app.get("/invertersdata", async (req, res) => {
  try {
    const _res = await getInverterListByPlantId("682346ba-d594-4bd5-a734-433bd27dbc53");
    res.json({ inverters: _res.data.data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

const db = require('./database/connection.js');
const { exec } = require('child_process');

function monitorDatabase() {
    const connection = db;
    

    let lastId = 0; // Initialize lastId with a default value

    // Function to get the last ID from the database
    function getLastId(callback) {
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

    function checkForChanges() {
      // console.log(lastId);
      // Query the database for new rows since the last known ID
      const query = connection.query('SELECT * FROM inverter_data WHERE STR_TO_DATE(last_refresh_time, "%Y-%m-%d %H:%m:%s") > ?', [lastId]);
      query.on('result', (row) => {
          // Handle new row insertion
          // console.log('New row inserted:', row);
  
          // Execute main.py script
          // exec('python main.py', (error, stdout, stderr) => {
          //     if (error) {
          //         console.error(`Error executing main.py: ${error}`);
          //         return;
          //     }
          //     console.log(`main.py output: ${stdout}`);
  
          //     // Execute cleaning.py script
          //     exec('python cleaning.py', (cleanError, cleanStdout, cleanStderr) => {
          //         if (cleanError) {
          //             console.error(`Error executing cleaning.py: ${cleanError}`);
          //             return;
          //         }
          //         console.log(`cleaning.py output: ${cleanStdout}`);
          //     });
          // });
      });
  
      // Handle MySQL errors
      connection.on('error', (err) => {
          console.error('MySQL error:', err);
      });
  }

    // Start monitoring
    getLastId(() => {
        // // Check for changes immediately
        checkForChanges();

        // Poll the database periodically for changes
        // const intervalInMilliseconds = 10 * 1000; // 10 seconds
        // setInterval(checkForChanges, intervalInMilliseconds);
    });
}

monitorDatabase();

// function checkForChanges() {
//   // console.log(lastId);
//    // Query the database for new rows since the last known ID
//    const query = connection.query('SELECT * FROM inverter_data WHERE STR_TO_DATE(last_refresh_time, "%Y-%m-%d %H:%m:%s") > ?', [lastId]);
//    query.on('result', (row) => {
//        // Handle new row insertion
//        console.log('New row inserted:', row);

//        // Execute Python script
//        exec('Python main.py', (error, stdout, stderr) => {
//            if (error) {
//                console.error(Error executing Python script: ${error});
//                return;
//            }
//            console.log(Python script output: ${stdout});
//        });
//    });

//    // Handle MySQL errors
//    connection.on('error', (err) => {
//        console.error('MySQL error:', err);
//    });
// }


