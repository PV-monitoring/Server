const axios = require('axios')
const fs = require('fs')
const path = require('path')

const ACC_USER= process.env.ACC_USER
const ACC_PWD= process.env.ACC_PWD
const BaseURL= process.env.BaseURL
const GetToken= process.env.GetToken

let data = JSON.stringify({
  "account": ACC_USER,
  "pwd": ACC_PWD
})

let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: `${BaseURL}${GetToken}`,
  headers: { 
    'Content-Type': 'application/json'
  },
  data : data
}

async function APISignIn() {
  const res = await axios.request(config)
  fs.writeFileSync(path.join(__dirname, "config.json"), JSON.stringify({token:res.data.data.token}))
  return res.data.data.token
}

module.exports = { APISignIn }