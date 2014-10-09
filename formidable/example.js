var formidable = require('formidable'),
    http = require('http'),
    fs = require("fs"),
    url = require('url'),
    catche = [];
    /*
    the data in catche looks like
    {
      'filepath': null,
      'filename': null,
      'contype': null
    }
    */

function show(response) {
  console.log("Request handler 'show' was called.");
  fs.readFile("/tmp/Tulips.jpg", "binary", function(error, file) {
    if(error) {
      response.writeHead(500, {"Content-Type": "text/plain"});
      response.write(error + "\n");
      response.end();
    } else {
      response.writeHead(200, {"Content-Type": "image/jpeg","Content-Disposition":"filename=Tulips.jpg"});
      response.write(file, "binary");
      response.end();
    }
  });
}

function sendDataToPc(response,tmpfile,filename,contype) {console.log(tmpfile,filename,contype);
  console.log("Request handler 'sendDataToPc' was called.");
  fs.readFile(tmpfile, "binary", function(error, file) {
    if(error) {
      response.writeHead(500, {"Content-Type": "text/plain"});
      response.write(error + "\n");
      response.end();
    } else {
      var fileName = "filename=" + filename;
      response.writeHead(200, {"Content-Type": contype,"Content-Disposition":fileName});
      response.write(file, "binary");
      response.end();
    }
  });
}


function start(response) {
  console.log("Request handler 'start' was called.");

  var body = '<html>'+
    '<head>'+
    '<meta http-equiv="Content-Type" content="text/html; '+
    'charset=UTF-8" />'+
    '</head>'+
    '<body>'+
    '<form action="/upload" enctype="multipart/form-data" '+
    'method="post">'+
    '<input type="file" name="wifiSync1" multiple="multiple">'+
    '<input type="submit" value="Upload file" />'+
    '</form>'+
    '</body>'+
    '</html>';

    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(body);
    response.end();
}    

http.createServer(function(req, res, body) {
  console.log('Client request',req.method.toLowerCase());
  //get data
  var reqfrom = url.parse(req.url, true);
  if(reqfrom.query.pc == 'alan'){
    var interval = setInterval(function(){
      if(catche.length){
        var message = catche.shift();
        sendDataToPc(res,message.filepath,message.filename,message.contype);
        clearInterval(interval); 
        
      }
    },10);
  }

  //get data from device and save 
  if (req.url == '/upload' && req.method.toLowerCase() == 'post') {
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
        var path = "/tmp/" + fileName;
        var message = {
          'filepath':path,
          'filename':fileName,
          'contype':contentTpye
        };
        catche.push(message);
      }); 

    });
   
  }

  //get data via explorer
  if(req.url == '/get'){
    start(res);
  }

  //show image
  if(req.url == '/show'){
    show(res);
  }


}).listen(1337,'192.168.1.108');

console.log('server start!');





