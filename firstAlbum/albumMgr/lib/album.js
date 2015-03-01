/*
	This file helps to fetch the albumbs in given path
*/

var fs = require('fs'),
	Album = require('./albums.js');

	exports.version = "1.0.0"

	exports.albums = function (path, callback){
		var albumPath = path + "albums/";
		fs.readdir(albumPath, function(err, albumList){
			if(err){
				callback(err);
				return;
			}

			var albumsOnly = [];	//assuming that all sub directories present in albums directory are albums

			(function iterator(index){
				if(index == albumList.length){
					callback(null, albumsOnly);
					return;
				}
				var album = albumPath + albumList[index];
				fs.stat(album, function(err, stats){
					if(err){
						callback({error : "File Error" , message : JSON.stringify(err)});
						return;
					}
					if(stats.isDirectory(album)){
						//console.log("album.Js: album: " + album);
						albumsOnly.push(Album.createAlbum(album));
					}
					iterator(index + 1);
				});
			}) (0);

		});
	}