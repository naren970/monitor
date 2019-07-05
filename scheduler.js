const find = require('find-process');
const Request = require('request');
var io = require('socket.io-client');
var socket;
var MongoClient = require('mongodb').MongoClient;
let db, conn;
let url = "mongodb://localhost:27017/";
let  client;
//let SSH2Utils = require('ssh2-utils');

let serviceMonitorPollInterval = 9000;




//let serviceMonitorPollInterval = 50000;


//Set of Porcess to do healthCheck which includes 
//few standalone & web based applciation 
let serviceList = [{
  "service_name":"mongo",
  "port" : 27017,
  "type" : "tcp",
  "restart_required" : true
},
{
  "service_name":"node1",
  "port" : 8081,
  "type" : "tcp",
  "restart_required" : true
},
{
  "service_name":"node2",
  "port" : 8082,
  "type" : "https", 
  "restart_required" : false
},
{
  "service_name":"node3",
  "port" : 8083,
  "type" : "https", 
  "restart_required" : false
},
{
  "service_name":"node4",
  "port" : 8084,
  "type" : "tcp", 
  "restart_required" : true
}];



//Update the Db Status on Success/Failure
async function updateServiceStatus (serviceName, serviceStatus, errMsg) {
    console.log('Updating the DB to Service Status ', serviceStatus);
    db.collection('services').
      updateOne({'service_name':serviceName}, 
                  {$set:{'status':serviceStatus, 'error':errMsg}}, (err, res)=>{
                    console.log('Updated the Service Status ', JSON.stringify(res));
                });
}
  


//Will do helathchecks of tcp based Service 
function isPorcessRunning(portNum, serviceName){

find('port', portNum)
.then(function (list) {//On Success of Finding the porcess
  console.log("the List params", list);
  let serviceStatus = 1; 
  let err = '';
  if (!list.length) {
    console.log('port ', portNum ,' is free now');
    err = 'No Process is running';
    serviceStatus  = 0;
    let serviceDetails = {
        "serviceName":serviceName,
        "serviceStatus": serviceStatus,
        "err" : ''
    }
    updateServiceStatus(serviceName, serviceStatus, err);
    socket.emit('server_event', serviceDetails);

    //Add Auto-restart Code
  } else {
    serviceStatus = 1;
    err ='';
    let serviceDetails = {
      "serviceName":serviceName,
      "serviceStatus": serviceStatus,
      "err" : ''
  }
    console.log('%s is listening port ', portNum,' , list[0].name');
    updateServiceStatus(serviceName, serviceStatus, err);
    socket.emit('server_event', serviceDetails);

  }
}).catch(error=>{//On Error while finding the services
  console.log("Error in Finding the process ", error);
  serviceStatus = 0;
  err = error;
  let serviceDetails = {
    "serviceName":serviceName,
    "serviceStatus": serviceStatus,
    "err" : ''
  }
  updateServiceStatus(serviceName, serviceStatus, err);
  socket.emit('server_event', serviceDetails);
});
}



//Will start doing Helath Checks of Services
async function doHealthCheck(){
  console.log("Inside checkAllServices");

  console.log("Inside checkAllServices");
  conn =  await MongoClient.connect(url);
  //console.log('DB Connection :', conn);
  
  db = conn.db('stezy_services');
  //console.log('DB :', db);
  var serviceName = 'node';
  var serviceStatus = 2;




    socket = io.connect('http://localhost:3000', {
      reconnection : true
    });

    var serviceResp = {
      serviceName : "s1"
    }
    /*socket.emit('client_event', function(data){
      console.log("Recived Data from Servcer", data);
    })*/
    socket.emit('server_event', serviceResp);



  for(let count =0; count < serviceList.length; count++){
    //Getting Each service Type
    let servName = serviceList[count].service_name;
    let servType = serviceList[count].type;
    let servPort = serviceList[count].port;
    //let servUrl = serviceList[count].url;
    let servRestartRequired = serviceList[count].restart_required;
    isPorcessRunning(servPort, servName);


    // if(servType == "tcp"){
    //   isPorcessRunning(servPort, servName);
    // }else if( servType == "https"){
    //   isSiteRunning("https://www.google.com/", "google");
    // } 
  }
  setTimeout(doHealthCheck, serviceMonitorPollInterval);
}


/*(function(){
  console.log("Imin self Execution");
  setTimeout(checkAllServices, 1000);
})(); */
doHealthCheck();


