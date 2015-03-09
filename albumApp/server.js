var http = require('http');
var fs = require('fs');
var url = require('url');
var filereader = require('./fileStreamReader.js');
var albums = require('./listAlbums.js');

function handleIncomingRequest(req,res){
	// parse the query params into an object and get the location
	// without them. (true for 2nd param means parse the params).
	req.parsed_url = url.parse(req.url, true);
	var core_url = req.parsed_url.pathname;

	// test this fixed url to see what they're asking for
	if (core_url.substring(0, 7) == '/pages/' ) {
		servePage(req, res);
	} 
	else if (core_url.substring(0, 11) == '/templates/' ) {
		filereader.fileReader("templates/" + core_url.substring(11), res);
	}
	else if (core_url.substring(0, 9) == '/content/' ) {
		filereader.fileReader("content/" + core_url.substring(9), res);
	}
	else if (core_url == '/albums.json') {
		handleListAlbums(req, res);
	}
	else if (core_url.substr(0, 7) == '/albums' && core_url.substr(core_url.length - 5) == '.json') {
		handleGetAlbumPhotoes(req, res);
	}
	else {
		send_failure(res, 404, "Invalid Resource");
	}
}

function handleListAlbums(req,res){
	// parse the query params into an object and get the location
	// without them. (true for 2nd param means parse the params).
	req.parsed_url = url.parse(req.url, true);
	var core_url = req.parsed_url.pathname;
	albums.getAlbums(core_url, function(err, albumList){
        if(err){
            send_failure(res, 401 , "Error in loading AlbumList");
        }
        for(albumInd = 0; albumInd < albumList.length; albumInd++){
            console.log("albums Name " + albumList[albumInd]);
        }
        sendSuccess(res,200,albumList,".json");
    });
}

function sendSuccess(res, code, result, ct){
    var contType = getContentType(ct);
    var albums = {
        error : null,
        albums : result
        };
    console.log("result Obj: " + JSON.stringify(albums));
    res.writeHead(200,{"Content-type" : contType});
    //res.end(albums );
     res.end(JSON.stringify(albums));
}

function getContentType(ext){
    switch(ext){
        case '.html' : return "text/html";
        case '.jpeg' : case '.jpg' : return 'image/jpeg';
        case '.js' : return	"text/javascript";
        case '.css' : return "text/css";
        case '.json' : case '.md' : return "application/json";
        default : return 'text/html';
    }

}

function send_failure(res, code, errMsg){
    var body = errMsg;
    var content_length = body.length;
    console.log("error message: " + errMsg);
    res.writeHead(code, {Content_Lengh : content_length, Content_Type : "text/plain"});
    res.end(JSON.stringify(body));
}

function servePage (req, res) {
	var core_url = req.parsed_url.pathname;
	var page = core_url.substring(7);// remove /pages/

	// currently only support home!
	if (page != 'home') {
		send_failure(res, 404, "invalid_page");
	return;
	}

	//fileReader.fileReader('basic.html',res);

	fs.readFile('basic.html',function (err, contents) {
		if (err) {
			send_failure(res, 500, err);
			return;
		}
		contents = contents.toString('utf8');
		// replace page name, and then dump to output.
		contents = contents.replace( '{{PAGE_NAME}}' , page);
        //console.log("contents: " + contents);
		res.writeHead(200, { "Content-Type": "text/html" });
		res.end(contents);
	});
}

var server;
server = http.createServer(handleIncomingRequest);
server.listen(3000);
