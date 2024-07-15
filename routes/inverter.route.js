const express = require('express');

const inverterController = require('../controllers/inverter.controller');

const router = express.Router();

router.post('/getInverterListByPlantId', inverterController.getInverterListByPlantId);

module.exports = router;