var express = require('express');

var app = express();

function handleIncomingRequest(req,res){
    res.writeHead("200", {"Content-type" : "application/json"});
    res.end("Hello World");
}

app.get('/', handleIncomingRequest);

app.get('/papillonVille/:albumName/:saree', function(req,res){
    var albumName = req.params.albumName;
    var queryParams = req.query;
    res.writeHead("200", {"Content-type" : "application/json"});
    res.end("Thanks for visiting Papillon Ville for " + albumName + JSON.stringify(queryParams) + "\nSite is under construction \nPlease visit later");
});

app.listen(3000);