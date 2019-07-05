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
//var ssh = new SSH2Utils();
    
var server = {host: "192.168.1.2", username:"narendra", password:"narendra" };


//Set of Porcess to do healthCheck which includes 
//few standalone & web based applciation 
let serviceList = [/*{
  "service_name":"mongo",
  "port" : 27017,
  "type" : "tcp",
  "url" :"",
  "restart_required" : true
},
{
  "service_name":"apache2",
  "port" : 80,
  "type" : "tcp",
  "url":"",
  "restart_required" : true
},
{
  "service_name":"google",
  "port" : "",
  "url":"https://www.google.com/",
  "type" : "https", 
  "restart_required" : false
},
{
  "service_name":"facebook",
  "port" : "",
  "url":"https://www.facebook.com/",
  "type" : "https", 
  "restart_required" : false
},*/
{
  "service_name":"node",
  "port" : 80,
  "type" : "tcp", 
  "restartRequired" : true,
  "restartCmd": "sudo systemctl start apache2" ,
  'server':{
    "host": "192.168.43.96", 
    "username":"naren", 
    "password":"naren"
  }
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

function restartService(ssh, hostDetails){
  let serviceName = hostDetails.serviceName;
  let serviceStatus = 0;
  let err = '';
  console.log('Restart Details ', hostDetails);
  ssh.run(hostDetails.remoteHost, [hostDetails.restartCmd], async function(err,stdout,stderr,serverDetails,conn){
    
    if(err) {
      console.log('Error on Restarting ', err);
      updateServiceStatus(serviceName, serviceStatus, err);
    }
    stdout.on('data', function(data){
    
      console.log(''+data);
      console.log('Success on Restarting');
      updateServiceStatus(serviceName, serviceStatus, '');
    });
    stderr.on('data', function(data){
      err = data;
      console.log('Stderr on Restarting');
      updateServiceStatus(serviceName, serviceStatus, data);
        
    });
    stdout.on('close',function(){
    console.log('Closing the Connection');
    conn.end();
    });
  });
}

//Will do helathchecks of tcp based Service 
async function isPorcessRunning(serverDetails, portNum, serviceName, restartCmd){
console.log('Inside Processing Running');
let serviceStatus = 0; 
let err = '';
let isPorcessRunning = false;
let cmd = 'lsof -t -i:'+portNum;
console.log('Command is ', cmd);
console.log('Server Details :', serverDetails);
let restartDetails = {};
restartDetails.remoteHost = serverDetails;
restartDetails.restartCmd = restartCmd;
restartDetails.serviceName = serviceName;

ssh.run(serverDetails, [cmd], async function(err,stdout,stderr,serverDetails,conn){
  if(err) {
    console.log('On  Error');
    updateServiceStatus(serviceName, serviceStatus, err);
    console.log('Service Name  %s and Status %s', serviceName, serviceStatus);
    console.log("Error in ", err);
    socket.emit('server_event', {'service': serviceName, 'status': serviceStatus});
    return err;
  }
  stdout.on('data', function(data){
    serviceStatus = 1;
    successStream = true;
    err = '';
    console.log('On Successfully found the data');
    console.log(''+data);
    console.log('Service Name  %s and Status %s', serviceName, serviceStatus);
    updateServiceStatus(serviceName, serviceStatus, err);
    socket.emit('server_event', {'service': serviceName, 'status': serviceStatus});
  });
  stderr.on('data', function(data){
    err = data;
    console.log(' stderr');
    console.log(''+data);
    console.log('Service Name  %s and Status %s', serviceName, serviceStatus);
    updateServiceStatus(serviceName, serviceStatus, err);
    socket.emit('server_event', {'service': serviceName, 'status': serviceStatus});

  });
  console.log('isProcessRunning', isPorcessRunning);
  if(!isPorcessRunning){
    console.log('No Process Found');
    err = 'No Process Found on port';
    console.log('Service Name  %s and Status %s', serviceName, serviceStatus);
    updateServiceStatus(serviceName, serviceStatus, err);    
    socket.emit('server_event', {'service': serviceName, 'status': serviceStatus});
    restartService(ssh, restartDetails);
    console.log('Trying to restart the service ');


  }
    stdout.on('close',function(){
    console.log('Closing the Connection');
    conn.end();
  });
});

}





//Will start doing Helath Checks of Services
async function doHealthCheck(){
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

    //saveDefaultService();
    
  /*for(let count =0; count < serviceList.length; count++){
    //Getting Each service Type
    let servName = serviceList[count].service_name;
    let servType = serviceList[count].type;
    let servPort = serviceList[count].port;
    let servUrl = serviceList[count].url;
    let servRestartRequired = serviceList[count].restart_required;
    let hostDetials = serviceList[count].server;
    let restartCmd = serviceList[count].restartCmd;
    if(servType == "tcp"){
      isPorcessRunning(hostDetials, servPort, servName, restartCmd);
    } 
  }*/
  setTimeout(doHealthCheck, serviceMonitorPollInterval);
}


doHealthCheck();



