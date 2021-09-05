const path = require('path');

const express = require('express');

// https://www.techighness.com/post/validate-uploaded-csv-data-node-express/

const { importController } = require('../controllers/importController');


const router = express.Router();

router.get('/importCsv', importController.handler);


module.exports = router;
