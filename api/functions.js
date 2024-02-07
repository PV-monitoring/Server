const axios = require("axios");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
const { tokenCheck } = require("./token.js");

const BaseURL = process.env.BaseURL;
const GetUserPlantList = process.env.GetUserPlantList;


// Get config
async function getConfig() {
  const config = fs.readFileSync(path.join(__dirname, "config.json"));
  return JSON.parse(config.toString());
}



// Get User Plant Data
async function _GetUserPlantList() {
  token = await getConfig();
  const _res = await axios.post(
    `${BaseURL}${GetUserPlantList}`,
    { page_index: 1, page_size: 10 },
    {
      headers: {
        token: token.token,
        "Content-Type": "application/json",
      },
    }
  );
  if (_res.data.code === 100002) {
    await tokenCheck(GetUserPlantList);
  }
  return _res;
}

module.exports = { _GetUserPlantList };
