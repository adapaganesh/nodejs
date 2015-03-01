var albumApp = require('./albumMgr');

albumApp.albums('./albumMgr/', function(err, albums){
	//all the albums in ./albums/ subfolder got returned through albums variable
	if(err){
		console.log("Un-expected error: " + JSON.stringify(err));
		return;
	}
	(function iterator(index){
		if(index == albums.length){
			console.log("Done!");
			return;
		}
		//albumApp.createAlbum(albumNames[index]).photos(function(err, photos){
		albums[index].photos(function(err, photos){
			if(err){
				console.log("Error loading Album: " + JSON.stringify(err));
				return;
			}
			console.log("============================");
			console.log("Album name: " + albums[index].name);
			console.log("photos: " + photos);
			//console.log("============================");
			iterator(index + 1);
		});
	}) (0);

});