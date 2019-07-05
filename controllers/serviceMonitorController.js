let serviceModel = require('./../models/servicesModel');
let express = require('express');
exports.getServiceStatus =  async (Request, Reply) =>{

    console.log("Im in API");
    let result =  await serviceModel.getAllServices().
    then(res=>{
        //console.log('REsult is ', res);
        res.toArray((err, data)=>{
            console.log("The Data is ", data);
            
            Reply.status(200).send(data);
        })
    }).catch(err=>{
        console.log('Error in Controller', err);
        Reply.status(400).send(err);
    });

}