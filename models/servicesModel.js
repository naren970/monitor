var MongoClient = require('mongodb').MongoClient;
let db, conn;
let url = "mongodb://localhost:27017/";
let  client;


/*pool.query('SELECT NOW()', (err, res) => {
  console.log(err, res)
  pool.end()
})*/

//var MongoClient = require('mongodb').MongoClient;
//var url = 'mongodb://localhost:27017/stezy_services';
async function dbConn(){
  try {
    conn =  await MongoClient.connect(url);
    db = conn.db('stezy_services');
    console.log('Connected DB Successfully');
    return db;
  } catch (error) {
    console.log('Error in Conneccting DB', error);    
  }

}




exports.getAllServices = async () =>{
    let dbService = await dbConn();
    return  dbService.collection('services').find({}, {projection:{_id:0}})
}