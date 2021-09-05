const path = require('path');

const express = require('express');


const { readController } = require('../controllers/readController');

const { policyController } = require('../controllers/readController');


const { serviceController } = require('../controllers/readController');



const router = express.Router();

router.get('/search',readController.schema, readController.handler);

router.get('/policy',policyController.schema, policyController.handler);

router.post('/service',serviceController.schema, serviceController.handler);


module.exports = router;
