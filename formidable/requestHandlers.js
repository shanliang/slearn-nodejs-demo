var formidable = require('formidable'),
    fs = require("fs")
    catche = {};

function sendDataToPc(response,request,query) {
  console.log("Request handler 'sendDataToPc' was called.");
  var deviceId = query.deviceId;
  var interval = setInterval(function(){
      if(catche[deviceId]){
        var message = catche[deviceId];
        delete catche[deviceId];
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

function getDataFromDevice(response,request,query){
  // parse a file upload
    var form = new formidable.IncomingForm();
    form.uploadDir = "./tmp";
    form.parse(request, function(err, fields, files) {console.log(files);
      var filePath,
          fileName,
          contentTpye,
          deviceId = query.deviceId;

      for( item in files){
        filePath = files[item].path;
        fileName = files[item].name;
        contentTpye = files[item].type; console.log('deviceId',deviceId);
        fs.exists('/tmp/' + deviceId, function (exists) {
          if(!exists){
            fs.mkdirSync("/tmp/"  + deviceId);
          }
          fs.renameSync(filePath, "/tmp/" + deviceId +"/" + fileName);
        });
        
      }

      response.end('ok',function(){
        var path = "/tmp/" + deviceId +"/" + fileName;
        var message = {
          'filepath':path,
          'filename':fileName,
          'contype':contentTpye
        };
        catche[deviceId] = message;
      }); 

    });
}


exports.sendDataToPc = sendDataToPc;
exports.getDataFromDevice = getDataFromDevice;
