const express = require('express');

const plantController = require('../controllers/plant.controller');

const router = express.Router();

router.get('/getGenerationData', plantController.getGenerationData);

module.exports = router;