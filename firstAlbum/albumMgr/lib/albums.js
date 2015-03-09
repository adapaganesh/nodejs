/*
	This file helps to list the photoes in the given album
*/

var fs = require('fs'),
	path = require('path');

function Album(albumPath){
	this.name = path.basename(albumPath);
	this.location = albumPath;
}

Album.prototype.name = null;
Album.prototype.location = null;
Album.prototype._photos = null;

Album.prototype.photos = function (callback){
	if(this._photos != null){
		callback(null,this._photos);
		return;
	}

	var self = this;

	fs.readdir(self.location, function(err, files){
		if(err){
			if(err.errcode == "ENOENT"){
				callback(noSuchAlbum());
			}
			else{
				callback({error : "file_error", message : JSON.stringify(err)});
			}
		}
		var picsOnly = [];
		(function iterator(index){
			if(index == files.length){
				self._photos = picsOnly;
				callback(null, self._photos);
				return;
			}

			photo = self.location + "/" + files[index];
			fs.stat(photo, function(err, stats){
				if(err){
					callback({error : "file_error", message : JSON.stringify(err)});
					return;
				}
				if(stats.isFile()){
					picsOnly.push(files[index]);
				}
				iterator(index + 1);
			});
		}) (0);
	});
}

exports.createAlbum = function (path){
	return new Album(path);
}

function noSuchAlbum(){
	return{ error : "no such Album", message : "The specified Album does not present" };
}