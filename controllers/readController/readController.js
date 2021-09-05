
const mongoModel = require('../../models/mongoQuery');
const { query } = require('express-validator');
const Response = require('./../../utils/response');
const validateInput = require('./../../utils/validate');

const schema = [

    query('searchKey').exists().withMessage('searchKey is missing'),

]

const handler = (req, res) => {

    let myResponse;


    const searchData = () => {
        return new Promise(async (resolve, reject) => {


            /*  let condition = [
                 // { $addFields: { result: { $regexMatch: { input: "$firstName", regex: /lura lucca/i } } } },
                 { $addFields: { result: { $regexMatch: { input: "$firstName", regex: new RegExp(req.query.searchKey, 'i') } } } },
                 { $match: { "result": true } },
                 {
                     $lookup: {
                         from: "Policy",
                         localField: "_id",
                         foreignField: "userId",
                         as: "policyInfo"
                     }
                 },
 
             ]; */
            let condition = [
                // { $addFields: { result: { $regexMatch: { input: "$firstName", regex: /lura lucca/i } } } },
                { $addFields: { result: { $regexMatch: { input: "$firstName", regex: new RegExp(req.query.searchKey, 'i') } } } },

                { $match: { "result": true } },
                {
                    $lookup: {
                        from: "Policy",
                        let: { "id": "$_id" },
                        pipeline: [
                            {
                                $match:
                                {
                                    $expr:

                                        { $eq: ["$userId", "$$id"] }

                                }
                            },
                            { $project: { policy_number: 1, policy_start_date: 1, policy_end_date: 1, policy_type: 1, _id: 0 } }
                        ],
                        as: "policyInfo"
                    }
                }



            ];

            const result = await mongoModel.aggregate(condition, 'User');
            console.log('--data search result', result);
            if (result && result.length) {
               
                myResponse = new Response(200, null, "Details fetched", { result});
                resolve(myResponse);
            } else {
                myResponse = new Response(204);
                reject(myResponse);
            }
        })


    }
    validateInput(req)
        .then(searchData)
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