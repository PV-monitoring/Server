const express = require('express');

const inverterController = require('../controllers/inverter.controller');

const router = express.Router();

router.get('/getDetails', inverterController.getDetails);

module.exports = router;