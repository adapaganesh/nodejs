var http = require('http'),
 fs = require('fs'),
 url = require('url'),
 path = require('path');

function serveStaticFile(file,res){
	var contents;
	var rs = fs.createReadStream(file);
	ct = getContentType(file);

	rs.on('readable',function(){
		var str;
		var d = rs.read();
		if(d){
			if(typeof d == 'String'){
				str = d;
			}
			else if(typeof d == 'object' && d instanceof Buffer){
				str = d.toString('utf8');
			}
			if(str){
				if(!contents){
					contents = str;
				}
				else{
					contents += str;
				}
			}
		}
	});

	rs.on('end', function(){
		console.log("Read in the file contents: ");
		console.log(contents);
		res.writeHead(200, {"Content-type" : ct});
		res.end(contents);
	});

	rs.on('error', function(e){
		res.writeHead(404,{"Content-type" : ct});
		var result = {
			error : "Not found",
			message : file + " is not found"
		}
		res.end(JSON.stringify(result) + "\n");
	});

	console.log("This will be printed first");
	console.log("==========================");
}

function getContentType(file){
	var ext = path.extname(file).toLowerCase();
	switch(ext){
		case '.html' : return "text/html";
		case '.jpeg' : case '.jpg' : return 'image/jpeg';
		case '.js' : return	"text/javascript";
		case '.css' : return "text/css";
		case '.json' : case '.md' : return "application/json";
		default : return 'text/html';
	}
}

function handleIncomingReq(req,res){
	var urlDetails = url.parse(req.url);
	if(req.method.toLowerCase() == 'get' &&  urlDetails.pathname == '/albumMgr'){
		serveStaticFile("./" + urlDetails.pathname + "/" + urlDetails.query,res);
	}
	else{
		res.writeHead(404,{"Content-type" : "application/json"});
		var result = {
			error : "Not found",
			message : urlDetails.query + " is not found"
		}
		res.end(JSON.stringify(result) + "\n");
	}
}

var server = http.createServer(handleIncomingReq);
server.listen(3000);