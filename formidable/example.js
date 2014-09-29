var formidable = require('formidable'),
    http = require('http'),
    fs = require("fs"),
    url = require('url'),
    message = '';

http.createServer(function(req, res, body) {
  console.log('Client request',req.method.toLowerCase(),req.url);
  //get data
  var reqfrom = url.parse(req.url, true);
  if(reqfrom.query.pc == 'alan'){
    var interval = setInterval(function(){
      if(message.length){
        res.writeHead(200, {'content-type': 'text/html'});
        res.end(message);
        message = '';
        clearInterval(interval); 
      }
    },10);
  }

  //send data
  if (req.url == '/upload' && req.method.toLowerCase() == 'post') {
    // parse a file upload
    var form = new formidable.IncomingForm();
    form.uploadDir = "./tmp";
    form.parse(req, function(err, fields, files) {
      console.log(files);
      for( item in files){
        var name = files[item].lastModifiedDate.getTime();
        fs.renameSync(files[item].path, "/tmp/" + name + ".jpg");
      }
      
      if(fields.device ==='iphone'){
        if((message.length === 0)){
          message = fields.datas;
        }
      }
      res.end('ok');      
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


}).listen(1337,'192.168.81.59');

console.log('server start!');

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



