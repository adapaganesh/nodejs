var http = require('http'),
	fs = require('fs'),
	url = require('url'),
	filereader = require('./fileStreamReader.js'),
	albums = require('./listAlbums.js');

function handleIncomingRequest(req,res){
	// parse the query params into an object and get the path
	// without them. (true for 2nd param means parse the params).
	req.parsed_url = url.parse(req.url, true);
	var core_url = req.parsed_url.pathname;

	// test this fixed url to see what they're asking for
	if (core_url.substring(0, 7) == '/pages/' ) {
		servePage(req, res);
	} 
	else if (core_url.substring(0, 11) == '/templates/' ) {
		filereader.fileStreamReader("templates/" + core_url.substring(11), res);
	}
	else if (core_url.substring(0, 9) == '/content/' ) {
		filereader.fileStreamReader("content/" + core_url.substring(9), res);
	}
	else if (core_url == '/albums.json') {
		handleListAlbums(req, res);
	}
	else if (core_url.substr(0, 7) == '/albums' && core_url.substr(core_url.length - 5) == '.json') {
		handleGetAlbumPhotoes(req, res);
	}
	else {
		send_failure(res, 404, invalid_resource());
	}
}

function handleListAlbums(req,res){
	// parse the query params into an object and get the path
	// without them. (true for 2nd param means parse the params).
	req.parsed_url = url.parse(req.url, true);
	var core_url = req.parsed_url.pathname;
	albums.getAlbums();
}

function servePage (req, res) {
	var core_url = req.parsed_url.pathname;
	var page = core_url.substring(7);// remove /pages/

	// currently only support home!
	if (page != 'home') {
		send_failure(res, 404, invalid_resource());
	return;
	}

	filereader.fileStreamReader('basic.html',res);

	fs.readFile('basic.html',function (err, contents) {
		if (err) {
			send_failure(res, 500, err);
			return;
		}
		contents = contents.toString('utf8');
		// replace page name, and then dump to output.
		contents = contents.replace( '{{PAGE_NAME}}' , page);
		res.writeHead(200, { "Content-Type": "text/html" });
		res.end(contents);
	});
}

var server = http.createserver(handleIncomingRequest);
server.listen(3000);
