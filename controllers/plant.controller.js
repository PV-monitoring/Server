const { getGenerationDataFromDB } = require('../database/getGenerationData.js');

const getGenerationData = async (req, res) => {
    try {
        const generationData = await getGenerationDataFromDB();
        res.status(200).json(generationData);
    } catch (error) {
        res.status(500).json({ error: error });
    }
}

module.exports = { getGenerationData };