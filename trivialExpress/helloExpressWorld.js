var express = require("express");

var app = express();

function handleIncomingRequest(req,res){
    res.writeHead(200, {"Content-type" : "application/json"});
    res.end("Hello World");
}
app.get('/', handleIncomingRequest);
app.listen(3000);

