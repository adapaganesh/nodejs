var fs = require('fs');

function FileObject(){
	this.filename = '';

	this.fileExists = function(callback){
		var self = this;
		console.log("About to open file: " + self.filename);

		fs.open(this.filename,'r',function(err,handle){
			if(err){
				console.log("Error opening file: " + self.filename);
				callback(err);
				return;
			}
			else{
				fs.close(handle,function () {});
				callback(null,true);
			}
		});
	}

}


var fo = new FileObject();
fo.filename = 'fileread.j';
fo.fileExists(function(err,result) {
	if(err){
		console.log("Ah! Bummer! " + JSON.stringify(err));
		return;
	}
	console.log("File Present");
});