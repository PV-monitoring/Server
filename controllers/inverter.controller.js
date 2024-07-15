const { _GetUserPlantList } = require("../api/functions.js");
const { insertDataIntoDatabase } = require("../database/insertDataToDB");
const {
    GET_INVERTER_LIST,
    BASE_URL
} = require("../utils/constants");
const { APISignIn } = require("../api/token.js");
const { getConfig } = require("../api/functions.js");
const axios = require("axios");

const getDetails = async (req, res) => {
    try {
        const _res = await _GetUserPlantList() 
        res.json({ mydata: _res.data });
        
        const table_name = "plants"
        const primary_key = "plant_id"
        await insertDataIntoDatabase(table_name, primary_key, _res.data.data.list)
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }
}

// Get User Plant Data by ID
const getInverterListByPlantId = async (plantId) => {
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
    return axios.post(`${BASE_URL}${GET_INVERTER_LIST}`, { plantid: plantId }, {
        headers: {
            token: token,
            "Content-Type": "application/json",
        },
    });
}

module.exports = { 
    getDetails,
    getInverterListByPlantId,
};