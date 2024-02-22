const express = require("express");
const http = require('http');
const cors = require("cors");
require("dotenv").config();
const { APISignIn } = require("./api/token.js");
const { _GetUserPlantList, getInverterListByPlantId } = require("./api/functions.js");
const { initializeWebSocket } = require('./sockets/socketsHandler.js');
const { insertDataIntoDatabase } = require('./database/getplants.js');

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
  console.log(`Server is running on port ${PORT}`);
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


app.get("/plants", async (req, res) => {
  try {
    const _res = await _GetUserPlantList();
    res.json({ plants: _res.data.data.list });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/invertersdata", async (req, res) => {
  try {
    const _res = await getInverterListByPlantId("682346ba-d594-4bd5-a734-433bd27dbc53");
    res.json({ inverters: _res.data.data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});
