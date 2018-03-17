var express = require("express");
var app = express();
var http = require("http").Server(app);
var path = require("path");
var io = require("socket.io")(http);
var mysql = require("mysql");

// init server

app.use(express.static(path.join(__dirname, "static")));

app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "index.html"));
});

http.listen(3000, function () {
    console.log("Listening on port 3000");
})

//socket stuff

io.on("connection", function(socket) {
    console.log("A user has connectd with the id of " + socket.id);
    socket.on("login request", function(credentials) {
        credentials[]
    });
});

//sql stuff

var con = mysql.createConnection({
  host: "localhost",
  user: "yourusername",
  password: "yourpassword"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected to mysql");
});