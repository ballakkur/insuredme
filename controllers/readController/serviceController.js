
const mongoModel = require('../../models/mongoQuery');
const db = require('../../utils/mongodb');
const { body } = require('express-validator');
const Response = require('./../../utils/response');
const validateInput = require('./../../utils/validate');

const schema = [

    body('name').exists().withMessage('name is missing'),

    body('description').exists().withMessage('description is missing'),

    body('timestamp').exists().withMessage('timestamp is missing'),


]

const handler = (req, res) => {

    let myResponse;
    console.log('----v', req.body);



    const serivceData = () => {
        return new Promise(async (resolve, reject) => {

            let indexData = {
                "createdAt": 1,
            }
            console.log('---',parseFloat(req.body.timestamp));
            console.log('---',Date.now());
            console.log('---',parseFloat(req.body.timestamp) - Date.now());
            console.log('---',(parseFloat(req.body.timestamp) - Date.now())/1000);
            indexData["expireAfterSeconds"] = (parseFloat(req.body.timestamp) - Date.now())/1000;

            await mongoModel.createIndex(indexData, 'Services');
            let data = {
                name: req.body.name,
                description: req.body.description,
                // createdAt: new Date(),
                expiresAt: parseFloat(req.body.timestamp),
                resave: true
            }

            const result = await mongoModel.insertOne({_id : data,createdAt : new Date()} , 'Services');
            // console.log('--data saved', result);
            if (result && result.result.n) {

                myResponse = new Response(200, null, "data saved", null);
                resolve(myResponse);
            } else {
                myResponse = new Response(204);
                reject(myResponse);
            }
        })


    }
    validateInput(req)
        .then(serivceData)
        .then((response) => {
            console.log('--- resolve-----', response);
            return res.status(response.status).send(response);
        })
        .catch((response) => {
            console.log('--- reject-----', response);
            return res.status(response.status).send(response);
        })




}


module.exports = {
    handler,
    schema
}