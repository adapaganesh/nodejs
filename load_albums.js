var http = require('http');
var fs = require('fs');

function load_album_list(callback){
	fs.readdir("albums", function(err,files){
		if(err){
				callback(err);
				return;
		}
		callback(null,files);
	});
}


function handle_incoming_request (req,res) {
	console.log("INCOMING REQUEST: " + req.method + " " + req.url);
	load_album_list(function(err,albums){
		if(err){
			res.writeHead(503, {"Content-type" : "application/json"});
			res.end(JSON.stringify(err) + "\n");
			return;
		}
		var out = {
			error : null,
			data : {
				albums : albums
			}
		}
			res.writeHead(200, {"Content-type" : "application/json"});
			res.end(JSON.stringify(out) + "\n");
	});
}

var server = http.createServer(handle_incoming_request);
server.listen(3000);