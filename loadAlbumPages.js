var http = require("http"),
	fs = require('fs'),
	url= require('url');

function loadAlbum(callback){
	fs.readdir("albums", function(err,albums){
		if(!err){
			var only_dirs = [];
			(function iterator(index){
				if(index == albums.length){
					callback(null,only_dirs);
					return;
				}
				var album = "albums/" + albums[index];
				fs.stat(album, function(err,stats){
					if(!err){
						if(stats.isDirectory()){
							only_dirs.push(albums[index]);
						}						
					}
					else{
						callback(err);
					}
					iterator(index+1);
				});
			} ) (0);
		}
		else{	//on error
			callback(err);
			return;
		}
	});
}

function loadAlbumContents(album, pageNum, pageSize ,callback){
	fs.readdir(album, function(err, photoes){
		if(!err){
			var only_files = [];
			(function iterator(index){
				if(index == photoes.length){
					var ps = only_files.splice((pageNum -1)*pageSize, pageSize);
					callback(null,ps);
					return;
				}
				var photo = album + photoes[index];
				fs.stat(photo, function(err, stats){
					if(!err){
						if(stats.isFile()){
							only_files.push(photoes[index]);
						}
					}
					else{
						callback(err);
					}
					iterator(index+1);
				});
			}) (0);
		}
		else{
			callback(err);
			return;
		}
	});
}

function handleAlbumRequest(res){
	loadAlbum(function(err,albums){
		if(!err){
			sendSuccess(res,200,albums);
		}
		else{
			makeError(res,err);
		}
	});
}

function handleAlbumContentRequest(req,res){
	var getp = req.parsed_url.query;
	var pageNum = getp.page?getp.page:0;
	var pageSize = getp.page_size?getp.page_size:1000;

	if(isNaN(parseInt(pageNum))) pageNum = 10;
	if(isNaN(parseInt(pageSize))) pageSize = 11000;

	//format of request is /album/albumName.json
	var core_url = req.parsed_url.pathname;
	var albumName = core_url.substr(1,core_url.length-6) + "/";

	loadAlbumContents(albumName, pageNum, pageSize ,function(err,photoes){
		if(!err){
			sendSuccess(res,200,photoes);
		}
		else{
			makeError(res,err);
		}
	});

}

function sendSuccess(res, code, result){
	var out = {
			error : null,
			data : {
					values : result
			}
	}
	res.writeHead(code, {"Content-type" : "application/json"});
	res.end(JSON.stringify(result) + "\n");
}

function makeError(res,err){
	res.writeHead(400,{"Content-type" : "application/json"});
	res.end(JSON.stringify(err) + "\n");
}

function handleIncomingRequest(req,res){
	console.log("Incoming Request: " + req.method + " " + req.url);
	req.parsed_url = url.parse(req.url,true);
	var core_url = req.parsed_url.pathname;
	if(core_url == "/albums.json"){
		//handleAlbumRequest(res);

	}
/*	else if(){

	}*/
	else{
		handleAlbumContentRequest(req,res);
	}
	//handleAlbumRequest();
}

var server = http.createServer(handleIncomingRequest);
server.listen(3000);