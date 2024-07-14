const { _GetUserPlantList } = require("../api/functions.js");
const { insertDataIntoDatabase } = require("../database/insertDataToDB");

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

module.exports = { 
    getDetails 
};