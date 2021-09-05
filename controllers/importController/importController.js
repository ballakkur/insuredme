
'use strict'
const fs = require('fs');
const csv = require('csvtojson');
const path = require('path');
const csvFilePath = path.join(__dirname, '..', '..', 'data', 'data.csv');
const {
    Worker, isMainThread
} = require('worker_threads');

const Response = require('./../../utils/response');


const schema = [
];
const handler = async (req, res) => {



    if (isMainThread) {

        console.log('-------11-22-', path.join(__dirname, '..', '..', 'data', 'data.csv'));
        console.log('-------11-11-', path.join(__dirname, '..', '..', 'worker', 'import', 'worker.js'));



        function runWorker(data) {

            // console.log('-dadad', data);
            return new Promise((resolve, reject) => {
                const worker = new Worker(path.join(__dirname, '..', '..', 'worker', 'import', 'worker.js'), {
                    workerData: data
                });
                worker.on("message", resolve) //This promise is gonna resolve when messages comes back from the worker thread
                worker.on("error", reject)
                worker.on("exit", code => {
                    if (code !== 0) {
                        reject(new Error(`Worker stopped with exit code ${code}`))
                    }
                })
            })
        }



        csv()
            .fromFile(csvFilePath)
            .then( async(jsonObj) => {

                console.log('-------jwon', typeof jsonObj);
                console.log('-------jwon', Array.isArray(jsonObj));
                // console.log('-------jwon',jsonObj);
                
                const worker = await runWorker(jsonObj)
                
                console.log('---worker',worker);
                let  myResponse = new Response(200, null, worker);
                return res.status(myResponse.status).send(myResponse);

               
            })


    } else {
        // const { parse } = require('some-js-parsing-library');
        console.log('non main thread');

    }



}


module.exports = {
    handler,
    schema
}