var http = require('http'),
    url = require('url'),
    requestHandlers = require("./requestHandlers"),
    sendDataToPc =  requestHandlers.sendDataToPc,
    getDataFromDevice =  requestHandlers.getDataFromDevice,
    start =  requestHandlers.start,
    show =  requestHandlers.show;



function onRequest(req,res){
  console.log('Client request',req.method.toLowerCase());
  //send data to pc
  var reqfrom = url.parse(req.url, true);
  if(reqfrom.query.pc == 'alan'){
    sendDataToPc(res);
  }

  //get data from device and save 
  if (req.url == '/upload' && req.method.toLowerCase() == 'post') {
    getDataFromDevice(req,res);  
  }

  //get data via explorer
  if(req.url == '/start'){
    start(res);
  }

  //show image
  if(req.url == '/show'){
    show(res);
  }
}    

http.createServer(onRequest).listen(1337,'192.168.1.108');

console.log('server start!');


var http = require('http'),
    url = require('url'),
    requestHandlers = require("./requestHandlers"),
    sendDataToPc =  requestHandlers.sendDataToPc,
    getDataFromDevice =  requestHandlers.getDataFromDevice,
    start =  requestHandlers.start,
    show =  requestHandlers.show;



function onRequest(req,res){
  console.log('Client request',req.method.toLowerCase());
  //send data to pc
  var reqfrom = url.parse(req.url, true);
  if(reqfrom.query.pc == 'alan'){
    sendDataToPc(res);
  }

  //get data from device and save 
  if (req.url == '/upload' && req.method.toLowerCase() == 'post') {
    getDataFromDevice(req,res);  
  }

  //get data via explorer
  if(req.url == '/start'){
    start(res);
  }

  //show image
  if(req.url == '/show'){
    show(res);
  }
}    

http.createServer(onRequest).listen(1337,'192.168.1.108');

console.log('server start!');


