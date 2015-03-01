var http = require('http');

function handle_incoming_request(req,res){
	console.log("INCOMING REQUEST: " + req.method + " " + req.url);
	res.writeHead(200, {"Content-type" : "application/json" });
	res.end(JSON.stringify({error : null}) + "\n")


/*	console.log("=================================================");
	console.log(req);
	console.log("=================================================");
	console.log(res);
	console.log("=================================================");
*/
}

var server = http.createServer(handle_incoming_request);
server.listen(3000);
