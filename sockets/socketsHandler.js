const { _GetUserPlantList, getInverterListByPlantId, getInverterData } = require("../api/functions.js");
const { Server } = require("socket.io");
require("dotenv").config();

function initializeWebSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("A client connected", socket.id);

    const sendPlantUpdates = async () => {
      try {
        const plants = await _GetUserPlantList();
        // console.log(plants.data.data.list);
        socket.emit("plantsUpdate", plants.data.data.list);
      } catch (error) {
        console.error("Error updating data:", error.message);
      }
    }

    const plantUpdateInterval = setInterval(sendPlantUpdates, 30000);

    socket.on("joinPlantRoom", async (plantId) => {
      console.log(`Client joined room for plant ${plantId}`);
      socket.join(plantId);

      const sendInverterUpdates = async () => {
        try {
          const inverterList = await getInverterListByPlantId(plantId);
          const inverterDataList = [];
          for (let i = 1; i < inverterList.data.data.total + 1; i++) {
            const inverterSN = inverterList.data.data.list.grid[i-1].invertersn;
            const inverterData = await getInverterData(inverterSN);
            inverterDataList.push(inverterData.data);
          }
          console.log(inverterDataList);
          io.to(plantId).emit("invertersUpdate", inverterDataList);
        } catch (error) {
          console.error("Error updating data:", error.message);
        }
      }

      const inverterUpdateInterval = setInterval(sendInverterUpdates, 60000);

      socket.on("disconnect", () => {
        console.log("A client disconnected", socket.id);
        clearInterval(inverterUpdateInterval);
      });
    });

    socket.on("disconnect", () => {
      console.log("A client disconnected", socket.id);
      clearInterval(plantUpdateInterval);
    });
  });
}

module.exports = { initializeWebSocket };
