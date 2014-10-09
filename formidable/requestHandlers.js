var formidable = require('formidable'),
    fs = require("fs")
    catche = [];

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

function sendDataToPc(response) {
  console.log("Request handler 'sendDataToPc' was called.");
  var interval = setInterval(function(){
      if(catche.length){
        var message = catche.shift();
        fs.readFile(message.filepath, "binary", function(error, file) {
          if(error) {
            response.writeHead(500, {"Content-Type": "text/plain"});
            response.write(error + "\n");
            response.end();
          } else {
            var fileName = "filename=" + message.filename;
            response.writeHead(200, {"Content-Type": message.contype,"Content-Disposition":fileName});
            response.write(file, "binary");
            response.end();
          }
        });
        clearInterval(interval);
      }
    },10);
  
}

function getDataFromDevice(request,response){
  // parse a file upload
    var form = new formidable.IncomingForm();
    form.uploadDir = "./tmp";
    form.parse(request, function(err, fields, files) {console.log(files);
      var filePath,fileName,contentTpye;

      for( item in files){
        filePath = files[item].path;
        fileName = files[item].name;
        contentTpye = files[item].type;
        fs.renameSync(filePath, "/tmp/" + fileName);
      }

      response.end('ok',function(){
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


exports.start = start;
exports.show = show;
exports.sendDataToPc = sendDataToPc;
exports.getDataFromDevice = getDataFromDevice;
