let SSH2Utils = require('ssh2-utils');
var ps = require('ps-node');
const find = require('find-process');

// var Client = require('ssh2').Client;
 
// var conn = new Client();
// conn.on('ready', function() {
//   console.log('Client :: ready');
//   conn.exec('netstat -a |grep 80', function(err, stream) {
//     if (err) throw err;
//     stream.on('close', function(code, signal) {
//       console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
//       conn.end();
//     }).on('data', function(data) {
//       console.log('STDOUT: ' + data);
//     }).stderr.on('data', function(data) {
//       console.log('STDERR: ' + data);
//     });
//   });
// }).connect({
//   host: '192.168.1.2',
//   port: 22,
//   username: 'narendra',
//   password: 'narendra'
// });

    var ssh = new SSH2Utils();
    
    var server = {host: "192.168.1.2", username:"narendra", password:"narendra" };
    

    // ssh.exec(server, 'lsof -i tcp:422', function(err,stdout,stderr){
    //     if(err) console.log(err);
    //     console.log(stdout);
    //     console.log(stderr);
    //     if(stderr){
    //         console.log('StdError ', stderr);
    //     }
    //     if(stdout){
    //         console.log('StdOut ',   stdout);
    //     }

    // });
    ssh.run(server, ['lsof -t -i:22'], function(err,stdout,stderr,server,conn){
        if(err) console.log("Error in ", err);
        stdout.on('data', function(data){
            console.log('Im in stdout');
            console.log(''+data);
        });
        stderr.on('data', function(data){
            console.log('Im in stdErr');
            console.log(''+data);
        });
        console.log('Server ', server);
        stdout.on('close',function(){
            console.log('Closing the Connection');
            conn.end();
        });
    });