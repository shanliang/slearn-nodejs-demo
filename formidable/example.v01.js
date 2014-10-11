var formidable = require('formidable'),
    http = require('http'),
    fs = require("fs"),
    url = require('url'),
    message = {
      'havedata': false,
      'filepath': null,
      'filename': null,
      'contype': null
    };

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
      message.havedata = false;
      res.end();
    }
  });
}

function getDataFromDevice(req,res){
  // parse a file upload
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
        message.havedata = true;       
        message.filepath = "/tmp/" + fileName;
        message.filename = fileName;
        message.contype = contentTpye;
      }); 

    });
}


http.createServer(function(req, res, body) {
  console.log('Client request',req.method.toLowerCase());
  //get data
  var reqfrom = url.parse(req.url, true);
  if(reqfrom.query.pc == 'alan'){
    var interval = setInterval(function(){
      if(message.havedata){
        sendDataToPc(res,message.filepath,message.filename,message.contype);
        clearInterval(interval); 
      }
    },10);
  }

  //get data from device and save 
  if (req.url == '/upload' && req.method.toLowerCase() == 'post') {
    getDataFromDevice(req,res);
   
  }
}).listen(1337,'192.168.1.108');

console.log('server start!');





