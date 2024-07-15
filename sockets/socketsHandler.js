const { getUserPlantList, getInverterListByPlantId, getInverterData, getPlantDetail } = require("../api/functions.js");
const { Server } = require("socket.io");
require("dotenv").config();
const {
  CLIENT_URL
} = require('../utils/constants.js');
const { insertDataIntoDatabase } = require('../database/insertDataToDB.js');
const { getStatus, getCleaningCycleUpdate } = require("../database/getDataFromDB.js");
const { getTodayGenerationDataFromDB } = require("../database/getGenerationData.js");

function initializeWebSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: CLIENT_URL,
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("A client connected", socket.id);

    const sendPlantUpdates = async () => {
      try {
        const plants = await getUserPlantList();

        // get dikkapitiya plant details
        const dikkapitiyaPlantDetails = await getPlantDetail("8ae4026b-2c18-47c2-8944-8b1c191ce789");
        dikkapitiyaPlantDetails.data.data.plant_id = "8ae4026b-2c18-47c2-8944-8b1c191ce789";
        plants.data.data.list.push(dikkapitiyaPlantDetails.data.data);

        // update inverter_data table with dikkapitiya inverter data
        // this is the dikkapitiya inverter sn
        const inverter = await getInverterData("5036KMTU221W0223");
        const dataWithoutMppt = removeMpptField(inverter.data.data);

        const table_name = "inverter_data";
        const primary_key = "last_refresh_time";

        await insertDataIntoDatabase(table_name, primary_key, dataWithoutMppt);

        // console.log(plants.data.data.list);
        socket.emit("plantsUpdate", plants.data.data.list);
      } catch (error) {
        console.error("Error updating data:", error.message);
      }
    }

    sendPlantUpdates(); // Send initial plant data
    const plantUpdateInterval = setInterval(sendPlantUpdates, 60000);

    socket.on("joinPlantRoom", async (plantId) => {
      console.log(`Client joined room for plant ${plantId}`);
      socket.join(plantId);

      const sendInverterUpdates = async () => {
        try {
          const inverterList = await getInverterListByPlantId(plantId);
          // console.log(inverterList.data);
          const inverterDataList = [];
          for (let i = 0; i < inverterList.data.data.total; i++) {
            const inverterSN = inverterList.data.data.list.grid[i].invertersn;
            await new Promise((resolve) => setTimeout(resolve, 1000));
            const inverterData = await getInverterData(inverterSN);
            // console.log(inverterData.data.data);
            inverterData.data.data.id = i + 1;
            inverterDataList.push(inverterData.data.data);
          }
          // console.log(inverterDataList);
          io.to(plantId).emit("invertersUpdate", inverterDataList);

        } catch (error) {
          console.error("Error updating data:", error.message);
        }
      }

      // sendInverterUpdates();
      const inverterUpdateInterval = setInterval(sendInverterUpdates, 10000);

      const sendStatus = async () => {
        try {
          // returns only the statys of dikkapitiya
          const status = await getStatus();
          // console.log(status[0].Status);
          socket.emit("statusUpdate", status[0].Status);
        } catch (error) {
          console.log(error.message);
        }
      }

      sendStatus();
      const sendStatusUpdate = setInterval(sendStatus, 10000);

      const sendCleaningCycleUpdate = async () => {
        try {
          const cleaningCycleUpdate = await getCleaningCycleUpdate();
          // console.log(new Date(cleaningCycleUpdate[0].estimated_date).toLocaleDateString());
          socket.emit("cleaningCycleUpdate", new Date(cleaningCycleUpdate[0].estimated_date).toLocaleDateString());
        } catch (error) {
          console.log(error.message);
        }
      }

      sendCleaningCycleUpdate();
      const sendCleaningCycleUpdateInterval = setInterval(sendCleaningCycleUpdate, 10000);

      const sendPowerUpdate = async () => {
        try {
          const todayGeneration = await getTodayGenerationDataFromDB();
          // console.log(todayGeneration[0]);
          socket.emit("powerUpdate", todayGeneration[0]);
        } catch (error) {
          console.log(error.message);
        }
      }

      sendPowerUpdate();
      const sendPowerUpdateInterval = setInterval(sendPowerUpdate, 10000);

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

const removeMpptField = (data) => {
  if (Array.isArray(data)) {
    return data.map(({ mppt, ...rest }) => rest);
  } else {
    const { mppt, ...rest } = data;
    return rest;
  }
};

module.exports = { initializeWebSocket };
