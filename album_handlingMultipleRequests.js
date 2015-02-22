var http = require('http'),
	fs = require('fs');

function load_albums(albums, callback){
	//console.log("albums: " + albums);
	fs.readdir(albums,function(err,files){
		if(!err){
			var only_dirs = [];
			(function iterator(index){
				if(index == files.length){
					callback(null,only_dirs);
					return;
				}
				var album = albums + "/" + files[index];
				//console.log("album: " + album);
				fs.stat(album, function(err,stats){
					if(!err){
						if(stats.isDirectory()){
							only_dirs.push(album);
						}
					}
					else{
						callback(err);						
					}
					iterator(index + 1);
				});
			}) (0);
		}
		else{
			callback(err);
			return;
		}
	});

}

function loadAlbumContents(albums,albumName,callback){
	var album = albums + "/" + albumName;
	fs.readdir(album, function(err, photoes){
		if(!err){
			var only_photoes = [];
			(function iterator(index){
				if(index == photoes.length){
					callback(null,only_photoes);
					return;
				}
				var photo = album + "/" + photoes[index];
				fs.stat(photo, function(err, stats){
					if(!err){
						if(stats.isFile()){
							only_photoes.push(photo);
						}
					}
					else{
						callback(err);
					}
					iterator(index + 1);
				});
			}) (0);
		}
		else{
			callback(err);
		}
	});
}

function handleIncomingRequests(req,res){
	console.log("Incoming Method: " + req.method + " " + req.url);
	if(req.url == "/albums.json"){
		console.log("loading albums");
		load_albums("albums",function(err,albums){
			if(!err){
				var result = {
					error : null,
					data : {
						albumNames : albums
					}				
				}
				res.writeHead(200, {"Content-type" : "application/json"});
				res.end(JSON.stringify(result) + "\n");
				return;
			}
			res.writeHead(503, {"Content-type" : "application/json"});
			res.end(JSON.stringify(err) + "\n");
		});
	}

	loadAlbumContents("albums", "funAtSydney", function(err, photoes){
		if(!err){
			var result = {
				error : null,
				data : {
					pics : photoes
				}
			}
			res.writeHead(200, {"Content-type" : "application/json"});
			res.end(JSON.stringify(result) + "\n");
		}
		else{
				console.log("Caught error");
				res.writeHead(503, {"Content-type" : "application/json"});
				res.end(JSON.stringify(err) + "\n");
		}
	});
}

var server = http.createServer(handleIncomingRequests);
server.listen(3000);