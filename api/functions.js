const axios = require("axios");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
const { APISignIn } = require("./token.js");
const { 
  BASE_URL,
  GET_USER_PLANT_LIST,
  GET_INVERTER_LIST,
  GET_INVERTER_BY_SN,
  GET_PLANT_DETAIL,
} = require("../utils/constants.js");

// Get config
function getConfig() {
  const config = fs.readFileSync(path.join(__dirname, "config.json"));
  return JSON.parse(config.toString());
}

// Get User Plant List
async function getUserPlantList() {
  try {
    let token = getConfig();
    let response = await getUserPlantListWithToken(token.token);

    // If token is invalid, try refreshing it once
    if (response.data.code !== 0) {
      token = await APISignIn();
      response = await getUserPlantListWithToken(token.token);
    }

    // If the token is still reported as invalid, throw an error
    if (response.data.code !== 0) {
      throw new Error("Token error after refresh");
    }

    return response;
  } catch (error) {
    console.error(error);
    throw error; // Rethrow the error after logging it
  }
}

// Function to make the API request
async function getUserPlantListWithToken(token) {
  return axios.post(`${BASE_URL}${GET_USER_PLANT_LIST}`, { page_index: 1, page_size: 100 }, {
    headers: {
      token: token,
      "Content-Type": "application/json",
    },
  });
}

async function getPlantDetail(plantId) {
  try {
    let token = await getConfig();
    let response = await getPlantDetailWithToken(plantId, token.token);

    // If token is invalid, try refreshing it once
    if (response.data.code !== 0) {
      token = await APISignIn();
      response = await getPlantDetailWithToken(plantId, token.token);
    }

    // If the token is still reported as invalid after refresh, throw an error
    if (response.data.code !== 0) {
      throw new Error("Token error after refresh");
    }

    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function getPlantDetailWithToken(plantId, token) {
  return axios.get(`${BASE_URL}${GET_PLANT_DETAIL}?plantid=${plantId}`, {
    headers: {
      token: token,
      "Content-Type": "application/json",
    },
  });
}

// Get User Plant Data by ID
async function getInverterListByPlantId(plantId) {
  try {
    let token = await getConfig();
    let response = await getInverterListByPlantIdWithToken(token.token, plantId);

    // If token is invalid, try refreshing it once
    if (response.data.code !== 0) {
      token = await APISignIn();
      response = await getInverterListByPlantIdWithToken(token.token, plantId);
    }

    // If the token is still reported as invalid after refresh, throw an error
    if (response.data.code !== 0) {
      throw new Error("Token error after refresh");
    }

    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Function to make the API request
async function getInverterListByPlantIdWithToken(token, plantId) {
  return axios.post(`${BASE_URL}${GET_INVERTER_LIST}`, { Plantid: plantId }, {
    headers: {
      token: token,
      "Content-Type": "application/json",
    },
  });
}

// Get Inverter By SN
async function getInverterData(inverterSN) {
  try {
    let token = await getConfig();
    let response = await getInverterDataWithToken(token.token, inverterSN);

    // If token is invalid, try refreshing it once
    if (response.data.code !== 0) {
      token = await APISignIn();
      response = await getInverterDataWithToken(token.token, inverterSN);
    }

    // If the token is still reported as invalid after refresh, throw an error
    if (response.data.code !== 0) {
      throw new Error("Token error after refresh");
    }



    return response;
  } catch (error) {
    console.error(error);
    throw error; // Rethrow the error after logging it
  }
}

// Function to make the API request
async function getInverterDataWithToken(token, inverterSN) {
  return axios.get(`${BASE_URL}${GET_INVERTER_BY_SN}`, {
    params: {
      invertersn: inverterSN,
    },
    headers: {
      token: token,
      "Content-Type": "application/json",
    },
  });
}



module.exports = { 
  getConfig,
  getUserPlantList, 
  getInverterListByPlantId, 
  getInverterData,
  getPlantDetail
};
