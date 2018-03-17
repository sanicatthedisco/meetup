var express = require("express");
var app = express();
var http = require("http").Server(app);
var path = require("path");
var io = require("socket.io");
var mysql = require("mysql");

app.use(express.static(path.join(__dirname, "static")));

app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "index.html"));
});

http.listen(3000, function () {
    console.log("Listening on port 3000");
})

