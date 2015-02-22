var http = require('http');
var fs = require('fs');

function load_albums(callback){
	fs.readdir("albums",function(err,files){
		if(err){
			callback(err);
			return;
		}
		var only_dirs = [];
		for(var i = 0; i < files.length; i++){
			console.log("file/dir name: " + files[i])
			fs.stat("albums/" + files[i], function(err,stats){
				if(!err){
					console.log("file name: " + files[i])
					console.log("stats: " + stats)
					if(stats.isDirectory()){
						only_dirs.push(files[i]);
					}
				}
			});
		}
		callback(null,only_dirs);
	});
}

function handle_incoming_request(req,res){
	console.log("INCOMING REQUEST: " + req.method + " " + req.url);
	load_albums(function(err, albums){
		if(err){
			res.writeHead(503,{"Content-type" : "application/json"});
			res.end(JSON.stringify(err) + "\n");
			return;
		}

		var result = {
			error : null,
			data : {
				albums : albums
			}
		}

		res.writeHead(200,{"Content-type" : "application/json"});
		res.end(JSON.stringify(result) + "\n");
	});
}

var server = http.createServer(handle_incoming_request);
server.listen(3000);
