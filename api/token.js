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
    await fs.writeFileSync(path.join(__dirname,"config.json"),JSON.stringify({token:res.data.data.token}))
    return res.data.data.token
}

async function tokenCheck(EndPoint) {
  const _token = await APISignIn();
  const _res = await axios.post(
    `${BaseURL}${EndPoint}`,
    { page_index: 1, page_size: 10 },
    {
      headers: {
        token: _token,
        "Content-Type": "application/json",
      },
    }
  );
  return _res
}

module.exports = { APISignIn, tokenCheck }