var formidable = require('formidable');
var http = require('http');
var fs = require("fs");
var url = require('url');
var EventEmitter = require('events').EventEmitter;
var reqList = [];
var eventEx = new EventEmitter();

eventEx.on('DataComing', function(postReq,data) {
  for(var i = 0; i< reqList.length; i++){
    if(reqList[i] != null && postReq.url == reqList[i].req.url ){
      sendDataToPc(reqList[i].res,data.filepath,data.filename,data.contype);
      reqList.splice(i,i+1);
      break;
    }
  }
  return;
});

function REQUEST(req, res){
  this.req = req || null;
  this.res = res || null;
}

function sendDataToPc(res,tmpfile,filename,contype) {  
  console.log("Request handler 'sendDataToPc' was called.");
  fs.readFile(tmpfile, "binary", function(error, file) {
    if(error) {
      res.writeHead(500, {"Content-Type": "text/plain"});
      res.write(error + "\n");
      res.end();
    } else {
      var fileName = "filename=" + filename;
      res.writeHead(200, {"Content-Type": contype,"Content-Disposition":fileName});
      res.write(file, "binary");
      res.end();
    }
  });
}

function getDataFromDevice(req,res){
  console.log("Request handler 'sendDataToPc' was called.");
  var form = new formidable.IncomingForm();
  form.uploadDir = "./tmp";
  form.parse(req, function(err, fields, files) {console.log(files);
    var filePath,fileName,contentTpye;

    for( item in files){
      filePath = files[item].path;
      fileName = files[item].name;
      contentTpye = files[item].type;
      fs.renameSync(filePath, "/tmp/" + fileName);
    }

    res.end('ok',function(){
      var message = {};   
      message.filepath = "/tmp/" + fileName;
      message.filename = fileName;
      message.contype = contentTpye;
      eventEx.emit('DataComing',req,message);
    }); 

  });
}


http.createServer(function(req, res, body) {
  console.log('Client request',req.method.toLowerCase());
  //get data
  if(req.method.toLowerCase() == 'get'){
    /*
    Push req & res into array 
    Must to create mutex to protect this variables. The memory is enough or not for more and more request???
    */
    reqList.push(new REQUEST(req,res));
  }

  //get data from device and save 
  if (req.method.toLowerCase() == 'post') {
    getDataFromDevice(req,res);
   
  }
}).listen(1337,'192.168.1.108');

console.log('server start!');





