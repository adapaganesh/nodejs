var fs = require('fs');

fs.open('test.js','r', function(err,handle){
	if(err){
		console.log("Error Code: " + err.code +
					" Error Message: " + err.message);
		return;
	}
	else{
		console.log("About to open the file");
		var buf = new Buffer(100000);
		fs.read(handle,buf,0,100000,null, function(err,length){
			if(err){
					console.log("Error Code: " + err.code +
					" Error Message: " + err.message);
					return;
			}
			else{
				console.log(buf.toString('utf8',0,length));
				console.log("Opened");
			fs.close(handle,function(){/*don't care*/});
			}
		}
		);
	}
}
);