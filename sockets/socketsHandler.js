const { _GetUserPlantList, getInverterListByPlantId, GetInverterData } = require("../api/functions.js");
const { queryDatabase } = require("../database/dbFunctions.js");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

function initializeWebSocket(server) {
  const httpServer = http.createServer(server);
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5000", // client's origin
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("A client connected");

    // Example: Send data to the client every second
    const dataUpdateInterval = setInterval(async () => {
      try {
        let idcount = 1; 
        const plants = await _GetUserPlantList();
        socket.emit("plantsUpdate", plants.data.data.list);
        
        // Iterate over each plant and fetch data for each inverter
        // Fetch plant IDs from the database
        const plantsFromDatabase = await queryDatabase("SELECT plant_id FROM plants");

        for (let row of plantsFromDatabase) {
          console.log(`${idcount} --> ${row.plant_id}`);
          idcount++;
          // plant id --> row.plant_id
          const inverterList = await getInverterListByPlantId(row.plant_id);
          // Iterate over each inverter and fetch data
          for (let inverterCount = 1; inverterCount < inverterList.data.data.total + 1; inverterCount++) {
            console.log(inverterCount);
            const inverterSN = inverterList.data.data.list.grid[inverterCount-1].invertersn;
            console.log(inverterSN);
            const inverterData = await GetInverterData(inverterSN);

            // Emit the fetched data to connected clients using Socket.IO
            // inverterList.data.data --> total & grid both
            socket.emit("invertersUpdate", {
              inverter_list: inverterList.data.data,
              plantId: row.plant_id,
              inverter_data: inverterData.data
            });
          }
        }
        console.log(`Data updated for all plants and inverters at ${new Date()}`);
        // console.log(plants.data.data)
      } catch (error) {
        console.error("Error updating data:", error.message);
      }
    }, 60000);

    socket.on("disconnect", () => {
      console.log("A client disconnected");
      clearInterval(dataUpdateInterval);
    });
  });

  httpServer.listen(5002, () => {
    console.log("Socket.IO server listening on port --> 5002");
  });
}

module.exports = { initializeWebSocket };
