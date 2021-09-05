
const mongoModel = require('../../models/mongoQuery');
const { query } = require('express-validator');
const Response = require('./../../utils/response');
const validateInput = require('./../../utils/validate');

const schema = [


]

const handler = (req, res) => {

    let myResponse;


    const policyData = () => {
        return new Promise(async (resolve, reject) => {

            let condition = [

                {
                    $group: {
                        _id: "$userId",
                        "policy_number": { $first: "$policy_number" },
                        "policy_start_date": { $first: "$policy_start_date" },
                        "policy_end_date": { $first: "$policy_end_date" },
                        "policy_type": { $first: "$policy_type" }
                    }
                },
                {
                    $lookup: {
                        from: "User",
                        let: { "id": "$_id" },
                        pipeline: [
                            {
                                $match:
                                {
                                    $expr:

                                        { $eq: ["$_id", "$$id"] }

                                }
                            },
                            { $project: { firstName: 1, _id: 0 } }
                        ],
                        as: "user"
                    }
                },
                //                 { $unwind : "$user" }
                { $limit :5 }

            ];

            const result = await mongoModel.aggregate(condition, 'Policy');
            console.log('--data search result', result);
            if (result && result.length) {

                myResponse = new Response(200, null, "Details fetched", { result });
                resolve(myResponse);
            } else {
                myResponse = new Response(204);
                reject(myResponse);
            }
        })


    }
    validateInput(req)
        .then(policyData)
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