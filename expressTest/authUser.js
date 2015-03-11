var express = require('express');

var app = express();

app.use(express.basicAuth(authUser));

function handleIncomingReq(req,res){
    res.send("secret message that only auth\'d users can see\n");
}
app.get('/', handleIncomingReq);

function authUser(user, pass){
    if(user == "Ganesh" && pass == "test1234"){
        return true;
    }
    else{
        return false;
    }
}
app.listen(3000);