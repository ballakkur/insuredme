'use strict'
const { ObjectID } = require("mongodb");
const { workerData, parentPort } = require("worker_threads")
const mongodQuery = require('../../models/mongoQuery');
const db = require('../../utils/mongodb');

// const mongodb = require('../../models/mongodb');
// console.log('-inside worker file',workerData);
//since this is worker process,it needs to connect to db
db.connect(async () => {

    // console.log('========', workerData);

    let AgentData = new Set();
    let UserData = [];
    let UserAccount = [];
    let LOB =  new Set();
    let Carrier = new Set();
    let Policy = [];

    workerData.forEach(element => {
        // AgentData.add({ "agent": element.agent }); //set
        AgentData.add( element.agent ); //set
        let mongoId = new ObjectID()
        UserData.push({
            _id : mongoId,
            firstName: element["firstname"],
            dob: element["dob"],
            address: element["address"],
            phone: element["phone"],
            state: element["state"],
            zip: element["zip"],
            email: element["email"],
            gender: element["gender"],
            userType: element["userType"],
        });

        Policy.push({
            policy_number: element["policy_number"],
            policy_start_date: element["policy_start_date"],
            policy_end_date: element["policy_end_date"],
            policy_end_date: element["policy_end_date"],
            policy_type: element["policy_type"],
            userId: mongoId
        })

        UserAccount.push({
            account_name: element["account_name"]
        });

       LOB.add(element["category_name"]);
       Carrier.add(element["company_name"]);


    });

    console.log('---agent',AgentData);
    console.log('---LOB',LOB);
    console.log('---Carrier',Carrier);

    let agentArray = Array.from(AgentData);
    let LOBArray = Array.from(LOB);
    let CarrierArray = Array.from(Carrier);

    console.log('------------');
  /*   console.log('-2--agent',agentArray);
    console.log('-2--LOB',LOBArray);
    console.log('-2--CarrierArray',CarrierArray); */
    
    agentArray =  agentArray.map(element =>{
        return { "agent": element }
    })
    LOBArray =  LOBArray.map(element =>{
        return { "category_name": element }
    })
    CarrierArray =  CarrierArray.map(element =>{
        return { "company_name": element }
    })
    console.log('-3--agent',agentArray);
    const agentData =  mongodQuery.insertMany(agentArray,'Agent');
    const userData =  mongodQuery.insertMany(UserData,'User');
    const UserAccountData =  mongodQuery.insertMany(UserAccount,'UserAccount');
    const lobData =  mongodQuery.insertMany(LOBArray,'LOB');
    const carrierData =  mongodQuery.insertMany(CarrierArray,'Carrier');
    const policyData =  mongodQuery.insertMany(Policy,'Policy');

    Promise.all([agentData,userData,UserAccountData,lobData,carrierData,policyData])
    .then((value)=>{
        console.log('--promoise resolved?',value);
        parentPort.postMessage({
            msg: 'data inserted successfully'
        })
    })



});//create a connection to mongodb



