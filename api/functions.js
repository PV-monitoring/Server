const axios = require("axios");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
const { APISignIn } = require("./token.js");

const BaseURL = process.env.BaseURL;
const GetUserPlantList = process.env.GetUserPlantList;
const GetPlantDetail = process.env.GetPlantDetail;

// Get config
async function getConfig() {
  const config = fs.readFileSync(path.join(__dirname, "config.json"));
  return JSON.parse(config.toString());
}

// Get User Plant List
async function _GetUserPlantList() {
  token = await getConfig();
  const response = await axios.post(
    `${BaseURL}${GetUserPlantList}`,
    { page_index: 1, page_size: 100 },
    {
      headers: {
        token: token.token,
        "Content-Type": "application/json",
      },
    }
  );
  if (response.data.code === 100002) {
    const _token = await APISignIn();
    const response = await axios.post(
      `${BaseURL}${GetUserPlantList}`,
      { page_index: 1, page_size: 10 },
      {
        headers: {
          token: _token,
          "Content-Type": "application/json",
        },
      }
    );
  }
  return response;
}


// Get User Plant Data by ID
async function getUserPlantDataById(plantId) {
  token = await getConfig();
  const response = await axios.get(
    `${BaseURL}${GetPlantDetail}`,
    { plantid: `${plantId}` },
    {
      headers: {
        token: token.token,
        "Content-Type": "application/json",
      },
    }
  );
  if (response.data.code === 100002) {
    const _token = await APISignIn();
    const response = await axios.post(
      `${BaseURL}${GetPlantDetail}`,
      { plantid: `${plantId}` },
      {
        headers: {
          token: _token,
          "Content-Type": "application/json",
        },
      }
    );
  }
  return response;
}


module.exports = { _GetUserPlantList, getUserPlantDataById };
