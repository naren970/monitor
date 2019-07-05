var MongoClient = require('mongodb').MongoClient;
var db;
let url = "mongodb://localhost:27017/";
const client;
function dbConnection (){

    client = await MongoClient.connect(url)
        .catch(err =>{ 
            console.log("Error in Connecting DB :", err); 
            }
        );

    if (!client) {
        return;
    }
}

dbConnection();

console.log('DB Connection :', client);


MongoClient.connect('mongodb://localhost:27017/', (err, client)=>{
    if(err){
        console.log('Errr in Connecting DB', err);
    }
    db = client.db('stezy_srevices');
    console.log('Result ', db);
    return db;
})

console.log(JSON.stringify(db));