/**
 * This script can be used to create, update, and delete sample data.
 * This script is especially helpful when testing change streams.
 */
const { MongoClient } = require('mongodb');


function closeChangeStream(timeInMs = 60000, changeStream) {

    return new Promise((resolve) => {

        setTimeout(() => {

            console.log("Closing the change stream");

            changeStream.close();

            resolve();

        }, timeInMs)

    })

};

async function monitorListingsUsingEventEmitter(client, timeInMs = 960000, pipeline = []) {

    const collection = client.db("insureme").collection("Services");

    const changeStream = collection.watch(pipeline);

    console.log('---1',timeInMs);
    changeStream.on('change', (next) => {
        console.log('event===========', next);
        const secondCollection = client.db("insureme").collection("secondCollection");
        secondCollection.insertOne({data: next.documentKey._id})
    });
    await closeChangeStream(timeInMs, changeStream);
}

async function main() {

    const uri = "mongodb://localhost:27017/insureme";


    const client = new MongoClient(uri, { useUnifiedTopology: true });

    try {
        // Connect to the MongoDB cluster
        await client.connect();
        console.log('---');
        const pipeline = [
            {
                $match: {
                    $and: [
                        { "documentKey._id.resave": true },
                        {  operationType:'delete' }
                      ]
                   
                    
                }
            }
        ]
        await monitorListingsUsingEventEmitter(client,timeInMs =900000,pipeline);

    }
    finally {
        // Close the connection to the MongoDB cluster
        await client.close();
    }

}

main().catch(console.error);


// mongod --port 27017 --dbpath  C:\data\db\db0 --replSet rs0 --bind_ip localhost