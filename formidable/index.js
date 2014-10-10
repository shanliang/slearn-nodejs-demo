var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var handle = {}
handle["/"] = requestHandlers.start;
handle["/start"] = requestHandlers.start;
handle["/show"] = requestHandlers.show;
handle["/upload"] = requestHandlers.getDataFromDevice;
handle["/get"] = requestHandlers.sendDataToPc;

server.start(router.route, handle);