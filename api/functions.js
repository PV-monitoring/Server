const axios = require("axios");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
const { APISignIn } = require("./token.js");

const BaseURL = process.env.BaseURL;
const GetUserPlantList = process.env.GetUserPlantList;
const GetPlantDetail = process.env.GetPlantDetail;
const GetPlantPower = process.env.GetPlantPower;
const GetInverterList = process.env.GetInverterList;
const GetInverterBySN = process.env.GetInverterBySN;


// Get config
function getConfig() {
  const config = fs.readFileSync(path.join(__dirname, "config.json"));
  return JSON.parse(config.toString());
}

// Get User Plant List
async function _GetUserPlantList() {
  try {
    let token = getConfig();
    // console.log(token.token);
    let response = await getUserPlantListWithToken(token.token);
    console.log(response.data);

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
  return axios.post(`${BaseURL}${GetUserPlantList}`, { page_index: 1, page_size: 100 }, {
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
    throw error; // Rethrow the error after logging it
  }
}

// Function to make the API request
async function getInverterListByPlantIdWithToken(token, plantId) {
  return axios.post(`${BaseURL}${GetInverterList}`, { Plantid: plantId }, {
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
    let response = await makeRequestWithToken(token.token, inverterSN);

    // If token is invalid, try refreshing it once
    if (response.data.code === 100002) {
      token = await APISignIn();
      response = await makeRequestWithToken(token.token, inverterSN);
    }

    // If the token is still reported as invalid after refresh, throw an error
    if (response.data.code === 100002) {
      throw new Error("Token error after refresh");
    }

    return response;
  } catch (error) {
    console.error(error);
    throw error; // Rethrow the error after logging it
  }
}

// Function to make the API request
async function makeRequestWithToken(token, inverterSN) {
  return axios.get(`${BaseURL}${GetInverterBySN}`, {
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
  _GetUserPlantList, 
  getInverterListByPlantId, 
  getInverterData 
};
