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

var loginSuccess;
var foundFriend;
var clients = [];

io.on("connection", function(socket) {
    console.log("A user has connectd with the id of " + socket.id);
    clients.push(socket);
    socket.loggedIn = false;
    
    socket.on("disconnect", function () {
        clients.splice(clients.indexOf(socket), 1);
    });
    
    socket.on("login request", function(credentials) {
        con.query("SELECT * FROM login_info", function(err, result, fields) {
            if (err) throw err;
            
            loginSuccess = false;
            
            for (var i = 0; i < result.length; i ++) {
                if (result[i]["username"] == credentials.username && result[i]["password"] == credentials.password) {
                    loginSuccess = true;
                    socket.name = result[i]["name"];
                    socket.username = credentials.username;
                    socket.loggedIn = true;
                }
            }
            
            if (loginSuccess) {
                socket.emit("login success", {
                    username: credentials.username,
                    name: socket.name
                });
            } else {
                socket.emit("login failure", {
                    reason: "Incorrect username or password"
                });
            }
        });
    });
    
    socket.on("add friend request", function(data) {
        foundFriend = false;
        
        for (var i = 0; i < clients.length; i ++) {
            if (clients[i].loggedIn) {
                console.log(clients[i].username);
                console.log(data.friendName);
                if (clients[i].username == data.friendName && socket.loggedIn) {
                    foundFriend = true;
                    console.log("added " + data.friendName);
                    
                    //insert friend into sql database
                    var sql = "INSERT INTO friends (username, friend) VALUES ('" + socket.username + "','" + data.friendName + "')";
                    con.query(sql, function (err, result) {
                        if (err) throw err;
                    });
                }
            }
        }
    });
});

//sql stuff

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "pass",
    database: "meetup"
});

con.connect(function(err) {
    if (err) throw err;
});