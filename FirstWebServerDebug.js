var http = require("http");

function processRequest(req,res){
	var body = "First Web Server Created! Congratulations!!!\n";
	var content_length = body.lenggth;	//body.length is intenally given a typo

	res.writeHead(200, {Content_Lengh : content_length, Content_Type : "text/plain"});
	res.end(body);
}

	http.createServer(processRequest).listen(3000);