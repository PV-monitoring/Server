const axios = require('axios');
const fs = require('fs');
const path = require('path');
const {
  GET_TOKEN,
  BASE_URL,
} = require("../utils/constants.js");

const ACC_USER= process.env.ACC_USER
const ACC_PWD= process.env.ACC_PWD

let data = JSON.stringify({
  "account": ACC_USER,
  "pwd": ACC_PWD
})

let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: `${BASE_URL}${GET_TOKEN}`,
  headers: { 
    'Content-Type': 'application/json'
  },
  data : data
}

async function APISignIn() {
  const res = await axios.request(config);
  fs.writeFileSync(path.join(__dirname, "config.json"), JSON.stringify({token:res.data.data.token}));
  return res.data.data.token;
}

module.exports = { APISignIn }